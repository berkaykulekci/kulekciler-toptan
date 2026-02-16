import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import axios from "axios";

// Load environment variables
dotenv.config({ path: ".env.local" });

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!TELEGRAM_TOKEN || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("Missing environment variables. Please check .env.local");
    process.exit(1);
}

// Initialize clients
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// State management (in-memory)
interface UserSession {
    step: "idle" | "awaiting_photos" | "awaiting_title" | "awaiting_stock" | "awaiting_description" | "awaiting_category";
    photos: string[]; // Array of file_ids from Telegram
    title?: string;
    stock?: number;
    description?: string;
    category?: string;
}

const sessions: Record<number, UserSession> = {};

// Helper to get or create session
const getSession = (chatId: number): UserSession => {
    if (!sessions[chatId]) {
        sessions[chatId] = { step: "idle", photos: [] };
    }
    return sessions[chatId];
};

// Helper: Download photo from Telegram
async function downloadTelegramPhoto(fileId: string): Promise<string> {
    const fileLink = await bot.getFileLink(fileId);
    const response = await axios({ url: fileLink, responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    const tempPath = path.join("/tmp", `${fileId}.jpg`);
    fs.writeFileSync(tempPath, buffer);
    return tempPath;
}

// Helper: Upload to Supabase Storage
async function uploadToSupabase(filePath: string): Promise<string | null> {
    const fileContent = fs.readFileSync(filePath);
    const fileName = `bot_uploads/${Date.now()}_${path.basename(filePath)}`;

    const { data, error } = await supabase.storage
        .from("products-image")
        .upload(fileName, fileContent, { contentType: "image/jpeg" });

    if (error) {
        console.error("Supabase upload error:", error);
        return null;
    }

    const { data: publicUrlData } = supabase.storage
        .from("products-image")
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}

const ALLOWED_USERS = process.env.ALLOWED_USERS ? process.env.ALLOWED_USERS.split(",").map(id => parseInt(id.trim())) : [];

// Middleware to check authorization
const isAuthorized = (msg: TelegramBot.Message): boolean => {
    const userId = msg.from?.id;
    if (!userId) return false;

    // If ALLOWED_USERS is empty or user is not in the list, deny access
    if (ALLOWED_USERS.length === 0 || !ALLOWED_USERS.includes(userId)) {
        console.log(`Unauthorized access attempt from User ID: ${userId} (${msg.from?.first_name})`);
        bot.sendMessage(userId, `⛔ Yetkisiz erişim! User ID: ${userId}\nBu bot özel kullanımdır.`);
        return false;
    }
    return true;
};

// Command: /start
bot.onText(/\/start/, (msg) => {
    if (!isAuthorized(msg)) return;

    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        "👋 Merhaba! Kulekciler Toptan Botuna Hoşgeldiniz.\n\n" +
        "Yeni ürün eklemek için /yeni komutunu kullanabilirsiniz."
    );
});

// Command: /yeni
bot.onText(/\/yeni/, (msg) => {
    if (!isAuthorized(msg)) return;

    const chatId = msg.chat.id;
    sessions[chatId] = { step: "awaiting_photos", photos: [] };
    bot.sendMessage(
        chatId,
        "📸 1. Adım: Lütfen ürün fotoğraflarını gönderin.\n" +
        "Birden fazla fotoğraf gönderebilirsiniz. Bittiğinde /bitti yazın."
    );
});

// Handle Photos
bot.on("photo", (msg) => {
    if (!isAuthorized(msg)) return;

    const chatId = msg.chat.id;
    const session = getSession(chatId);

    if (session.step !== "awaiting_photos") return;

    // Get the largest photo version
    const photo = msg.photo![msg.photo!.length - 1];
    session.photos.push(photo.file_id);
});

// Command: /bitti (Finish photo upload)
bot.onText(/\/bitti/, (msg) => {
    if (!isAuthorized(msg)) return;

    const chatId = msg.chat.id;
    const session = getSession(chatId);

    if (session.step !== "awaiting_photos") {
        return bot.sendMessage(chatId, "Önce /yeni komutu ile başlayın.");
    }

    if (session.photos.length === 0) {
        return bot.sendMessage(chatId, "Hiç fotoğraf göndermediniz. Lütfen en az bir fotoğraf gönderin.");
    }

    session.step = "awaiting_title";
    bot.sendMessage(chatId, "✅ Fotoğraflar alındı.\n📝 2. Adım: Lütfen ürün BAŞLIĞINI yazın.");
});

// Handle Text Messages (Step Flow)
bot.on("message", async (msg) => {
    if (!isAuthorized(msg)) return;
    if (!msg.text || msg.text.startsWith("/")) return; // Ignore commands

    const chatId = msg.chat.id;
    const session = getSession(chatId);

    // Step 2: Title
    if (session.step === "awaiting_title") {
        session.title = msg.text.trim();
        session.step = "awaiting_stock";
        return bot.sendMessage(chatId, `✅ Başlık: "${session.title}"\n🔢 3. Adım: Lütfen STOK adedini girin (Sadece sayı).`);
    }

    // Step 3: Stock
    if (session.step === "awaiting_stock") {
        const stock = parseInt(msg.text);
        if (isNaN(stock)) {
            return bot.sendMessage(chatId, "❌ Lütfen geçerli bir sayı girin.");
        }
        session.stock = stock;
        session.step = "awaiting_description";
        return bot.sendMessage(
            chatId,
            `✅ Stok: ${stock}\n📄 4. Adım: Lütfen ürün AÇIKLAMASINI yazın.`
        );
    }

    // Step 4: Description
    if (session.step === "awaiting_description") {
        session.description = msg.text.trim();
        session.step = "awaiting_category";
        return bot.sendMessage(
            chatId,
            `✅ Açıklama kaydedildi.\n📂 5. Adım: Son olarak KATEGORİ'yi yazın (örn: Mutfak, Hediyelik, Züccaciye).`
        );
    }

    // Step 5: Category -> Process
    if (session.step === "awaiting_category") {
        session.category = msg.text.trim();
        session.step = "idle"; // Prevent re-entry

        bot.sendMessage(chatId, "⏳ İşleniyor... Fotoğraflar yükleniyor ve ürün kaydediliyor. Lütfen bekleyin.");

        try {
            // 1. Download and Upload Photos
            const imageUrls: string[] = [];
            for (const fileId of session.photos) {
                const localPath = await downloadTelegramPhoto(fileId);
                const publicUrl = await uploadToSupabase(localPath);
                if (publicUrl) imageUrls.push(publicUrl);

                // Clean up
                try { fs.unlinkSync(localPath); } catch { }
            }

            if (imageUrls.length === 0) {
                throw new Error("Fotoğraflar yüklenemedi.");
            }

            // 2. Insert into Supabase
            // Generate slug
            const slug = (session.title || "urun")
                .toLowerCase()
                .replace(/ğ/g, "g")
                .replace(/ü/g, "u")
                .replace(/ş/g, "s")
                .replace(/ı/g, "i")
                .replace(/ö/g, "o")
                .replace(/ç/g, "c")
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "") + `-${Date.now()}`; // Ensure uniqueness

            const { data: productData, error: dbError } = await supabase
                .from("products")
                .insert({
                    name: session.title,
                    slug: slug,
                    description: session.description,
                    category: session.category,
                    stock: session.stock,
                    package_info: "", // Optional, left empty for now
                    is_active: true,
                    is_featured: false,
                })
                .select("id")
                .single();

            if (dbError) throw dbError;

            // 3. Insert Images
            const imageRecords = imageUrls.map((url, index) => ({
                product_id: productData.id,
                image_url: url,
                sort_order: index,
            }));

            const { error: imgError } = await supabase
                .from("product_images")
                .insert(imageRecords);

            if (imgError) console.error("Image Insert Error:", imgError);

            bot.sendMessage(chatId, `✅ Ürün Başarıyla Eklendi!\n\n📦 **${session.title}**\n💰 Stok: ${session.stock}\n📄 Açıklama: ${session.description}\n📂 Kategori: ${session.category}\n\n🔗 Link: https://kulekciler.com/urunler/${slug}`);

        } catch (error: any) {
            console.error("Process Error:", error);
            bot.sendMessage(chatId, `❌ Bir hata oluştu: ${error.message}`);
        } finally {
            // Reset session
            sessions[chatId] = { step: "idle", photos: [] };
        }
    }
});

// --- HTTP Server for Render (Keep Alive) ---
import http from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("Telegram Bot is Active! 🤖");
});

server.listen(PORT, () => {
    console.log(`📡 HTTP Server is running on port ${PORT}`);
});

console.log("🤖 Telegram Botu (Manuel Mod) Başlatıldı...");

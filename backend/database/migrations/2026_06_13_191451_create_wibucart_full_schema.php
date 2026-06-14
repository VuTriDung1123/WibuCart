<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. CẬP NHẬT BẢNG USERS MẶC ĐỊNH
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable();
            $table->integer('total_points')->default(0);
            $table->string('rank_id')->default('Dong'); // Đồng, Bạc, Vàng
        });

        // 2. NHÓM TAXONOMY
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->timestamps();
        });

        Schema::create('series', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->timestamps();
        });

        Schema::create('characters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('series_id')->constrained('series')->onDelete('cascade');
            $table->string('name');
            $table->string('avatar_url')->nullable();
            $table->timestamps();
        });

        Schema::create('manufacturers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('country')->nullable();
            $table->timestamps();
        });

        // 3. NHÓM SẢN PHẨM CỐT LÕI
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->longText('description')->nullable();
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('series_id')->constrained('series');
            $table->foreignId('manufacturer_id')->constrained('manufacturers');
            $table->boolean('is_preorder')->default(false);
            $table->date('release_date')->nullable();
            $table->decimal('base_price', 15, 2);
            $table->timestamps();
        });

        Schema::create('product_characters', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('character_id')->constrained('characters')->onDelete('cascade');
            $table->primary(['product_id', 'character_id']);
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('sku_code')->unique();
            $table->decimal('price', 15, 2);
            $table->integer('stock_quantity')->default(0);
            $table->json('attributes')->nullable(); // Lưu {"version": "DX"}
            $table->timestamps();
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->unsignedBigInteger('variant_id')->nullable();
            $table->string('image_url');
            $table->boolean('is_cover')->default(false);
            $table->timestamps();
        });

        // 4. NHÓM NGƯỜI DÙNG & GIỎ HÀNG
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('full_name');
            $table->string('phone');
            $table->string('address_line');
            $table->string('province_id')->nullable();
            $table->string('district_id')->nullable();
            $table->string('ward_id')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained('carts')->onDelete('cascade');
            $table->foreignId('variant_id')->constrained('product_variants')->onDelete('cascade');
            $table->integer('quantity');
            $table->timestamps();
        });

        // 5. NHÓM ĐƠN HÀNG & THANH TOÁN
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code')->unique();
            $table->foreignId('user_id')->constrained('users');
            $table->decimal('total_amount', 15, 2);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('shipping_fee', 15, 2)->default(0);
            $table->decimal('final_amount', 15, 2);
            $table->string('status')->default('pending'); // pending, partial_paid, processing...
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('variant_id')->constrained('product_variants');
            $table->integer('quantity');
            $table->decimal('price_at_purchase', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('payment_method'); // COD, VNPay
            $table->string('transaction_id')->nullable();
            $table->decimal('amount', 15, 2);
            $table->string('payment_type'); // deposit, full, final_payment
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        Schema::create('point_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('order_id')->nullable();
            $table->integer('points');
            $table->string('reason');
            $table->timestamps();
        });

        // 6. NHÓM AI/ML & MARKETING
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->json('image_urls')->nullable();
            $table->string('status')->default('pending');
            // Cột dành cho mô hình NLP
            $table->string('ai_sentiment')->nullable(); // positive, negative, neutral
            $table->decimal('ai_confidence_score', 3, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('product_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('view_count')->default(1);
            $table->timestamp('last_viewed_at')->useCurrent();
            $table->timestamps();
        });

        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('type'); // percent, fixed
            $table->decimal('value', 15, 2);
            $table->decimal('min_order_value', 15, 2)->default(0);
            $table->decimal('max_discount_amount', 15, 2)->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->dateTime('valid_from')->nullable();
            $table->dateTime('valid_to')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('product_views');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('point_history');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('user_addresses');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_characters');
        Schema::dropIfExists('products');
        Schema::dropIfExists('manufacturers');
        Schema::dropIfExists('characters');
        Schema::dropIfExists('series');
        Schema::dropIfExists('categories');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'total_points', 'rank_id']);
        });
    }
};
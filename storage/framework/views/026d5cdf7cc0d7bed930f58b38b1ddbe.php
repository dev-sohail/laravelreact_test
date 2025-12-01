<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stripe Checkout</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 class="text-2xl font-bold mb-4">Checkout</h1>
        <p class="mb-6 text-gray-600">Product: T-shirt - $20.00</p>
        <form action="<?php echo e(route('checkout.session')); ?>" method="POST">
            <?php echo csrf_field(); ?>
            <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-200">
                Pay with Stripe
            </button>
        </form>
    </div>
</body>
</html>
<?php /**PATH C:\wamp64\www\laravel\resources\views/checkout.blade.php ENDPATH**/ ?>
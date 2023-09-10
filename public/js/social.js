// Function to share on Facebook
document.getElementById('facebook-share').addEventListener('click', function () {
    const shareURL = 'https://www.lightoftwelve.com';
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`;

    window.open(facebookURL, 'Share on Facebook', 'width=600,height=400');
});

// Function to share on Twitter
document.getElementById('twitter-share').addEventListener('click', function () {
    const shareText = 'Discover the power of holistic healing at Light of Twelve, your online destination for premium quality healing crystals, tarot card reading tutorials, astrology readings and crystal healing guides. Free worldwide shipping on orders over $70.00CAD';
    const shareURL = 'https://www.lightoftwelve.com';
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareURL)}`;

    window.open(twitterURL, 'Share on Twitter', 'width=600,height=400');
});

// Function to share on Pinterest
document.getElementById('pinterest-share').addEventListener('click', function () {
    const shareURL = 'https://www.lightoftwelve.com';
    const pinterestURL = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareURL)}`;

    window.open(pinterestURL, 'Share on Pinterest', 'width=600,height=400');
});

// Function to share on Tumblr
document.getElementById('tumblr-share').addEventListener('click', function () {
    const shareText = 'Discover the power of holistic healing at Light of Twelve, your online destination for premium quality healing crystals, tarot card reading tutorials, astrology readings and crystal healing guides. Free worldwide shipping on orders over $70.00CAD';
    const shareURL = 'https://www.lightoftwelve.com';
    const tumblrURL = `https://www.tumblr.com/share/link?url=${encodeURIComponent(shareURL)}&name=${encodeURIComponent(shareText)}`;

    window.open(tumblrURL, 'Share on Tumblr', 'width=600,height=400');
});

// Function to share on Telegram
document.getElementById('telegram-share').addEventListener('click', function () {
    const shareText = 'Discover the power of holistic healing at Light of Twelve, your online destination for premium quality healing crystals, tarot card reading tutorials, astrology readings and crystal healing guides. Free worldwide shipping on orders over $70.00CAD';
    const shareURL = 'https://www.lightoftwelve.com';
    const telegramURL = `https://t.me/share/url?url=${encodeURIComponent(shareURL)}&text=${encodeURIComponent(shareText)}`;

    window.open(telegramURL, 'Share on Telegram', 'width=600,height=400');
});

// Function to share via Email
document.getElementById('email-share').addEventListener('click', function () {
    const subject = 'Check out this website!'; // Replace with the email subject
    const body = 'Discover the power of holistic healing at Light of Twelve, your online destination for premium quality healing crystals, tarot card reading tutorials, astrology readings and crystal healing guides. Free worldwide shipping on orders over $70.00CAD';
    const emailURL = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = emailURL;
});

// Function to share on WhatsApp
document.getElementById('whatsapp-share').addEventListener('click', function () {
    const shareText = 'Discover the power of holistic healing at Light of Twelve, your online destination for premium quality healing crystals, tarot card reading tutorials, astrology readings and crystal healing guides. Free worldwide shipping on orders over $70.00CAD';
    const shareURL = 'https://www.lightoftwelve.com';
    const whatsappURL = `whatsapp://send?text=${encodeURIComponent(shareText + ' ' + shareURL)}`;

    window.location.href = whatsappURL;
});



function showProduct(productId) {
    const allProducts = document.querySelectorAll('.product-page');
    allProducts.forEach(product => {
        product.style.display = 'none';
    });
    

    const selectedProduct = document.getElementById(productId);
    if (selectedProduct) {
        selectedProduct.style.display = 'block';
    }
    
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.add('active');
    
    
    document.body.classList.add('modal-open');
}


function hideProduct() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    
    document.body.classList.remove('modal-open');
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        hideProduct();
    }
});


document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideProduct();
    }
});


function toggleMobileNav() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

function toggleEnquiry() {
    const enquiryForm = document.getElementById('enquiry-form');
    enquiryForm.style.display = enquiryForm.style.display === 'block' ? 'none' : 'block';
}


let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 5000);


if (slides.length > 0) {
    showSlide(0);
}


function changeLanguage(language) {
    const elements = document.querySelectorAll('[data-en][data-mr]');
    elements.forEach(element => {
        if (language === 'en') {
            element.textContent = element.getAttribute('data-en');
        } else if (language === 'mr') {
            element.textContent = element.getAttribute('data-mr');
        }
    });

}

window.onload = function () {
            changeLanguage("mr");
        };
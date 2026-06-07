// Esperar a que todo el documento HTML cargue antes de ejecutar las animaciones
document.addEventListener("DOMContentLoaded", () => {
    
    // ========================================================
    // 1. EFECTO MAGNÉTICO 3D (TARJETAS DE CRISTAL)
    // ========================================================
    const cards = document.querySelectorAll('.glass-card:not(.static-glass-card)'); // Excluimos la estática

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // ========================================================
    // 2. PANEL DE CONTROL DE IMÁGENES (CARRUSEL DEL INICIO)
    // ========================================================
    const misAnuncios = [
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2672&auto=format&fit=crop", // Desarrollo Web
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop", // Apps Móviles
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2670&auto=format&fit=crop"  // Cursos (AutoCAD/Office)
    ];

    const bannerImg = document.getElementById('banner-img');
    const dotsContainer = document.getElementById('carousel-dots');
    const carouselContainer = document.querySelector('.carousel-container');

    if (bannerImg && dotsContainer && carouselContainer) {
        let indiceActual = 0;
        let intervaloCarrusel;

        misAnuncios.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active'); 
            
            dot.addEventListener('click', () => {
                cambiarImagen(index);
                reiniciarTemporizador(); 
            });
            dotsContainer.appendChild(dot);
        });

        function cambiarImagen(index) {
            indiceActual = index;
            bannerImg.style.opacity = 0; 
            
            setTimeout(() => {
                bannerImg.src = misAnuncios[indiceActual];
                bannerImg.style.opacity = 0.85; 
                
                document.querySelectorAll('.dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === indiceActual);
                });
            }, 400); 
        }

        function iniciarTemporizador() {
            intervaloCarrusel = setInterval(() => {
                let siguienteIndice = (indiceActual + 1) % misAnuncios.length;
                cambiarImagen(siguienteIndice);
            }, 4000); 
        }

        function reiniciarTemporizador() {
            clearInterval(intervaloCarrusel); 
            iniciarTemporizador(); 
        }

        // --- Eventos para Celular y PC ---
        let touchStartX = 0;
        let touchEndX = 0;

        bannerImg.addEventListener('dragstart', (e) => e.preventDefault());

        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            procesarDeslizamiento();
        }, { passive: true });

        carouselContainer.addEventListener('mousedown', (e) => {
            touchStartX = e.clientX;
            carouselContainer.style.cursor = 'grabbing';
        });

        carouselContainer.addEventListener('mouseup', (e) => {
            touchEndX = e.clientX;
            carouselContainer.style.cursor = 'default';
            procesarDeslizamiento();
        });

        function procesarDeslizamiento() {
            const umbral = 50; 
            if (touchStartX - touchEndX > umbral) {
                let siguienteIndice = (indiceActual + 1) % misAnuncios.length;
                cambiarImagen(siguienteIndice);
                reiniciarTemporizador();
            } 
            else if (touchEndX - touchStartX > umbral) {
                let anteriorIndice = (indiceActual - 1 + misAnuncios.length) % misAnuncios.length;
                cambiarImagen(anteriorIndice);
                reiniciarTemporizador();
            }
        }

        iniciarTemporizador();
    }

    // ========================================================
    // 3. AUTO-COMPLETAR FORMULARIO SEGÚN EL SERVICIO ELEGIDO
    // ========================================================
    // Leemos la URL actual de la página
    const parametrosURL = new URLSearchParams(window.location.search);
    const servicioElegido = parametrosURL.get('servicio'); // Buscamos la palabra "servicio="
    const seleccionador = document.getElementById('asunto');

    // Si encontramos que en la URL dice un servicio Y estamos en la página de contacto...
    if (servicioElegido && seleccionador) {
        // Seleccionamos esa opción automáticamente
        seleccionador.value = servicioElegido;
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const geoBtn = document.getElementById('geo-btn');
    const geoResult = document.getElementById('geo-result');
    const cameraBtn = document.getElementById('camera-btn');
    const camera = document.getElementById('camera');
    const dragItem = document.getElementById('drag-item');
    const dropZone = document.getElementById('drop-zone');
    const dropResult = document.getElementById('drop-result');
    const devName = document.getElementById('dev-name');

    // Configuração inicial
    devName.textContent = "Larissa";

    // Geolocalização
    geoBtn.addEventListener('click', function() {
        geoResult.style.display = 'none';
        
        if (!navigator.geolocation) {
            geoResult.textContent = "Seu navegador não suporta geolocalização";
            geoResult.style.display = 'block';
            return;
        }
        
        geoResult.textContent = "Obtendo localização...";
        geoResult.style.display = 'block';
        
        navigator.geolocation.getCurrentPosition(
            function(pos) {
                const lat = pos.coords.latitude.toFixed(6);
                const lon = pos.coords.longitude.toFixed(6);
                geoResult.innerHTML = `
                    <p>Latitude: ${lat}</p>
                    <p>Longitude: ${lon}</p>
                    <a href="https://maps.google.com?q=${lat},${lon}" target="_blank">
                        Ver no mapa
                    </a>
                `;
            },
            function(err) {
                geoResult.textContent = "Erro: " + getGeoError(err);
            }
        );
    });

    function getGeoError(error) {
        switch(error.code) {
            case 1: return "Permissão negada";
            case 2: return "Localização indisponível";
            case 3: return "Tempo esgotado";
            default: return "Erro desconhecido";
        }
    }

    // Câmera
    cameraBtn.addEventListener('click', function() {
        if (camera.style.display === 'block') {
            stopCamera();
            cameraBtn.textContent = "Ligar Câmera";
        } else {
            startCamera();
            cameraBtn.textContent = "Desligar Câmera";
        }
    });

    function startCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    camera.srcObject = stream;
                    camera.style.display = 'block';
                })
                .catch(function() {
                    alert("Não foi possível acessar a câmera");
                });
        } else {
            alert("Seu navegador não suporta acesso à câmera");
        }
    }

    function stopCamera() {
        const stream = camera.srcObject;
        const tracks = stream.getTracks();
        
        tracks.forEach(function(track) {
            track.stop();
        });
        
        camera.srcObject = null;
        camera.style.display = 'none';
    }

    // Drag and Drop
    dragItem.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text', 'drag-item');
        setTimeout(() => this.style.opacity = '0.5', 0);
    });

    dragItem.addEventListener('dragend', function() {
        this.style.opacity = '1';
    });

    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.background = '#e1f1ff';
    });

    dropZone.addEventListener('dragleave', function() {
        this.style.background = '';
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.background = '';
        
        if (e.dataTransfer.getData('text') === 'drag-item') {
            dropResult.textContent = "Item solto com sucesso!";
            dropResult.style.display = 'block';
            
            setTimeout(() => {
                dropResult.style.display = 'none';
            }, 2000);
        }
    });
});
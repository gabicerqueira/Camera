var mediaStream;
var fotos = [];

window.onload = function () {
    const storedFotos = localStorage.getItem('fotos');
    if (storedFotos) {
        fotos = JSON.parse(storedFotos);
        exibirFotos();
    }
};

function abrirCamera(){
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then(function (stream){
        mediaStream = stream;

        const areaVideo = document.getElementById('camera');
        areaVideo.srcObject = stream;
        areaVideo.style.display = 'block';
    })
    .catch(function (error){
        console.error('Erro ao acessar a câmera:', error)
    });
}

function tirarFoto() {
    const areaVideo = document.getElementById('camera');
    const canvas = document.createElement('canvas');
    canvas.width = areaVideo.videoWidth;
    canvas.height = areaVideo.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(areaVideo, 0, 0, canvas.width, canvas.height);

    const legenda = prompt('Digite a legenda para a foto:'); // Solicita uma legenda

    const imageDataUrl = canvas.toDataURL(); // convertendo a imagem para o formato base64

    fotos.push({ url: imageDataUrl, legenda: legenda }); // adiciona a foto ao array com a legenda

    localStorage.setItem('fotos', JSON.stringify(fotos));

    exibirFotos(); // exibe todas as fotos na div 'foto'
}

function exibirFotos() {
    const fotoDiv = document.getElementById('foto');
    fotoDiv.innerHTML = '';

    fotos.forEach(function (foto, index) {
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('foto-container');

        const img = document.createElement('img');
        img.src = foto.url;
        img.alt = `Foto ${index + 1}`;
        img.classList.add('foto-item');

        img.addEventListener('click', function() {
            const downloadLink = document.createElement('a');
            downloadLink.href = foto.url;
            downloadLink.download = `foto_${index + 1}.png`;

            downloadLink.click();
            document.body.removeChild(downloadLink);
        });

        containerDiv.appendChild(img);

        if (foto.legenda) {
            const legendaP = document.createElement('p');
            legendaP.classList.add('legenda');
            legendaP.textContent = foto.legenda;
            containerDiv.appendChild(legendaP);
        }

        const lixoIcon = document.createElement('img');
        lixoIcon.src = 'img/lixeira.png';
        lixoIcon.alt = 'Excluir';
        lixoIcon.classList.add('lixo-icon');
        lixoIcon.addEventListener('click', function () {
            excluirFoto(index);
        });
        containerDiv.appendChild(lixoIcon);

        fotoDiv.appendChild(containerDiv);
    });
}

function excluirFoto(index) {
    fotos.splice(index, 1);

    localStorage.setItem('fotos', JSON.stringify(fotos));
    exibirFotos();
}

function fechar() {
    const fotoDiv = document.getElementById('foto');
    fotoDiv.style.marginTop = '60px'

    navigator.mediaDevices.getUserMedia({ video: false });
    const areaVideo = document.getElementById('camera');
    areaVideo.srcObject = null;
    mediaStream = null;
    areaVideo.style.display = 'none';
}

const foto = document.getElementById('foto');


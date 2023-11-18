export const getStrength = (password) => {
    if (password.trim() === '') {
        setStrength(null);
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        setStrength(null);
    } else {

        let strengthIndicator = -1,
        upper = false,
        lower = false,
        numbers = false,
        symbols = false;

        const symbolRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
        
        for (let index = 0; index < password.length; index++) {
            const char = password.charCodeAt(index);
            if (!upper && char >= 65 && char <= 90) {
                upper = true; 
                strengthIndicator++;
            }
            if (!numbers && char >= 48 && char <= 57) {
                numbers = true;
            strengthIndicator++;
            } 
            if (!lower && char >= 97 && char <= 122) {
                lower = true;
                strengthIndicator++;
            }
            if (!symbols && symbolRegex.test(password.charAt(index))) {
                symbols = true;
                strengthIndicator++;
            }
        }
        setStrength(strengthLevels[strengthIndicator]);
    }
};

export const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    
    return `${dia}-${mes}-${año} a las ${horas}:${minutos}`;
}

export const formatTextBr = (text) => {
    const formattedText = text.replace(/\n/g, "<br>");
    return formatTextBr;
} 

export const initCap = (str) => {
    if (str) {

        return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
            return match.toUpperCase();
        });
    } else {
        return 'Sin dato.'
    }
}

export const convertirFormatoFecha = (fechaEnFormatoISO) => {
    if (fechaEnFormatoISO) {

        const partes = fechaEnFormatoISO.split('-');
        if (partes.length === 3) {
            const [anio, mes, dia] = partes;
            const nuevaFecha = `${dia}-${mes}-${anio}`;
            return nuevaFecha;
        } else {
            // Manejo de error si el formato de entrada no es válido
            console.error('Formato de fecha no válido');
            return null;
        }
    }
}

export const convertirDiasANumeros = (diasString) => {
    const dias = diasString.split(',').map((dia) => dia.trim());
    const diasMapeados = dias.map((dia) => {
        switch (dia.toLowerCase()) {
            case 'l':
                return 1;
            case 'm':
                return 2;
            case 'x':
                return 3;
            case 'j':
                return 4;
            case 'v':
                return 5;
            case 's':
                return 6;
            case 'd':
                return 0;
            default:
                return null;
        }
    });

    return diasMapeados;
} 

export const convertirNumerosADias = (numerosString) => {
    const diasMapeados = numerosString.map((dia) => {
        switch (diasMapeados) {
            case 1:
                return 'l';
            case 2:
                return 'm';
            case 3:
                return 'x';
            case 4:
                return 'j';
            case 5:
                return 'v';
            case 6:
                return 's';
            case 0:
                return 'd';
            default:
                return null;
        }
    });

    return diasMapeados;
} 


export const convertirDiasATexto = (diasString) => {
    if (diasString) {

        const dias = diasString.split(',').map((dia) => dia.trim());
        const diasMapeados = dias.map((dia) => {
    
        switch (dia.toLowerCase()) {
            case 'l':
                return 'Lun ';
            case 'm':
                return 'Mar ';
            case 'x':
                return 'Mie ';
            case 'j':
                return 'Jue ';
            case 'v':
                return 'Vie ';
            case 's':
                return 'Sab ';
            case 'd':
                return 'Dom ';
            default:
                return null;
            }
        });
        return diasMapeados;
    } else {
        return null;
    }
} 
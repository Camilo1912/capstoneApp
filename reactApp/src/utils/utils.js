const getStrength = (password) => {
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

export default getStrength();
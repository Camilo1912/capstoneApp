import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { registrationSteps } from '../../utils/data';
import { useContext, useEffect, useState } from 'react';
import RegisterPersonalFields from './RegisterPersonalFields';
import RegisterResidentialFields from './RegisterResidentialFields';
import RegisterCredentialFields from './RegisterCredentialFields';
import { RegistrationContext } from '../../contexts/RegitrationContext';
import { register } from '../../requests/Register';
import { useAsyncError, useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import RegisterVerificationFields from './RegisterVerificationFields';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    const { 
        registrationForm,
        resetRegistrationForm } = useContext(RegistrationContext);
    const [activeStep, setActiveStep] = useState(0);
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    useEffect(() => {
        if (activeStep === 0 && registrationForm['firstname'] && registrationForm['lastname1'] && registrationForm['lastname2'] && registrationForm['rut'] && registrationForm['birthDate']) {
        setIsNextButtonDisabled(false);
        } else if (activeStep === 1 && registrationForm["regionId"] && registrationForm["communeId"] && registrationForm["neighborhoodId"] && registrationForm['street'] && registrationForm['number']){
        setIsNextButtonDisabled(false);
        } else if (activeStep === 2 && registrationForm['image_front'] && registrationForm['image_back'] && registrationForm['image_invoice'] && registrationForm['image_face']) {
            setIsNextButtonDisabled(false);
        } else if (activeStep === 3 && registrationForm["email"] && registrationForm["password"]) {
        setIsNextButtonDisabled(false);
        } else {
        setIsNextButtonDisabled(true);
        }
    }, [registrationForm, activeStep]);

    const handleSignIn = async (e) => {
        e.preventDefault();

        const newUserData = {
            'neighbor[first_name]': registrationForm['firstname'],
            'neighbor[second_name]': registrationForm['middlename'],
            'neighbor[last_name]': registrationForm['lastname1'],
            'neighbor[last_name_2]': registrationForm['lastname2'],
            'neighbor[birth_date]': registrationForm['birthDate'],
            'neighbor[email]': registrationForm['email'],
            'neighbor[street_address]': registrationForm['street'],
            'neighbor[number_address]': registrationForm['number'],
            'neighbor[rut]': registrationForm['rut'],
            'neighbor[password]': registrationForm['password'],
            'neighbor[neighborhood_id]': registrationForm['neighborhoodId'],
            'neighbor[commune_id]': registrationForm['communeId'],
            'neighbor[gender]': registrationForm['gender'],
            'image_front': registrationForm['image_front'],
            'image_back': registrationForm['image_back'],
            'image_face': registrationForm['image_face'],
            'image_invoice': registrationForm['image_invoice']
        }

        try {
            const response = await register(newUserData);
            if (response.status === 200) {
                toast.success('Solicitud de registro enviada correctamente', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
                handleReset();
                resetRegistrationForm();
                navigate("/");
            } else {
                console.log("Hubo un problema al crear el usuario. Código de estado: " + response.status);
            }
        
        } catch (error) {
            console.log(error);
        }
    }
  
    const handleBackToLogin = () => {
        resetRegistrationForm();
        navigate('/');
    }

  return (

    <div className='registration-card'>
      <div className='registration-card-title'>
        <Button onClick={handleBackToLogin} startIcon={<ArrowBackIosNewRoundedIcon />}>Volver</Button>
        <h1>Formulario de registro</h1>
      </div>
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {registrationSteps.map((step, index) => (
          <Step key={step.label}>

            <StepLabel> {step.label} </StepLabel>
            <StepContent>
              {activeStep == 0 ? <RegisterPersonalFields /> : (activeStep == 1) ? <RegisterResidentialFields /> : (activeStep == 2) ? <RegisterVerificationFields /> : <RegisterCredentialFields />}
              
              <div className='register-steps-buttons-container'>

                {activeStep == 0 ? <></>
                  :
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  > Paso anterior
                  </Button>
                }

                <Button
                  variant="contained"
                  disabled={isNextButtonDisabled}
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                  > {index === registrationSteps.length - 1 ? 'Siguiente' : 'Siguiente'}
                </Button>
              </div>
            </StepContent>

          </Step>
        ))}
      </Stepper>

      {activeStep === registrationSteps.length ?
        <div className='send-register-request-container'>
          <h2>Todos los pasos fueron completados</h2>
          <Typography>Deberás esperar a que la directiva de tu junta apruebe tu solicitud, haz clic en <strong>envíar</strong> para finalizar. </Typography>
          <div>
            <Button variant="contained" color='success' onClick={handleSignIn} endIcon={<SendIcon />}>
              Enviar Solicitud
            </Button>
          </div>
        </div>
        :
        <></>
      }
    </div>
  );
}

export default Register;
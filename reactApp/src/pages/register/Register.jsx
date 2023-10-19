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
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

const Register = () => {
  const navigate = useNavigate();
  const { 
    registrationForm,
    handleRegistrationForm,
    registrationStep,
    handleRegistrationStep,
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
    handleRegistrationStep(activeStep);
  }, [activeStep]);

  useEffect(() => {
    console.log(registrationForm['firstname']);
    if (activeStep === 0 && registrationForm['firstname'] && registrationForm['lastname1'] && registrationForm['lastname2'] && registrationForm['rut']) {
      setIsNextButtonDisabled(false);
    } else if (activeStep === 1 && registrationForm["regionId"] && registrationForm["communeId"] && registrationForm["neighborhoodId"]){
      setIsNextButtonDisabled(false);
    } else if (activeStep === 2 && registrationForm["email"] && registrationForm["password"]) {
      setIsNextButtonDisabled(false);
    } else {
      setIsNextButtonDisabled(true);
    }
  }, [registrationForm]);

  // const handleSignIn = () => {
  // }
  
  const handleBackToLogin = () => {
    resetRegistrationForm();
    navigate('/');
  }

  return (

    <div className='registration-card'>
      <Button onClick={handleBackToLogin} startIcon={<ArrowBackIosNewRoundedIcon />}>Volver al inicio</Button>
      <h1>Formulario de registro</h1>
      <Stepper activeStep={activeStep} orientation="vertical">
        {registrationSteps.map((step, index) => (
          <Step key={step.label}>

            <StepLabel> {step.label} </StepLabel>
            <StepContent>
              {activeStep == 0 ? <RegisterPersonalFields /> : (activeStep == 1) ? <RegisterResidentialFields /> : <RegisterCredentialFields />}
              
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
                  > {index === registrationSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
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
            <Button variant="outlined" color='error' onClick={handleBackToLogin} endIcon={<CancelRoundedIcon />}>
              Cancelar
            </Button>
            <Button variant="contained" endIcon={<SendIcon />}>
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
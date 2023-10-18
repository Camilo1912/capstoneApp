import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { registrationSteps } from '../../utils/data';
import { useState } from 'react';
import RegisterPersonalFields from './RegisterPersonalFields';
import RegisterResidentialFields from './RegisterResidentialFields';
import RegisterCredentialFields from './RegisterCredentialFields';
import RegistrationContextProvider from '../../contexts/RegitrationContext';

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <RegistrationContextProvider>

    <div className='registration-card'>
      <Stepper activeStep={activeStep} orientation="vertical">
        {registrationSteps.map((step, index) => (
          <Step key={step.label}>

            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Ultimo paso</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>

            <StepContent>

              <div>
                { activeStep == 0 ? <RegisterPersonalFields /> : (activeStep == 1) ? <RegisterResidentialFields /> : <RegisterCredentialFields />}

                <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                > Atras
                </Button>

                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                > {index === registrationSteps.length - 1 ? 'Registrarse' : 'Siguiente'}
                </Button>
              </div>

            </StepContent>

          </Step>
        ))}
      </Stepper>
      {activeStep === registrationSteps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
    </RegistrationContextProvider>
  );
}

export default Register;
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';

const CustomAuthenticator = ({ children }) => {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <Authenticator.SignUp
            headerText="Create Your Account"
            formFields={[
              {
                type: 'name',
                label: 'Please enter your name',
                placeholder: 'John Doe',
                required: true,
              },
              {
                type: 'email',
                label: 'What is your email address?',
                placeholder: 'example@example.com',
                required: true,
              },
              {
                type: 'custom:country',
                label: 'Which country are you from?',
                placeholder: 'United States',
                required: true,
              },
              {
                type: 'custom:hospital',
                label: 'Which hospital are you affiliated with?',
                placeholder: 'ABC Hospital',
                required: true,
              },
              {
                type: 'custom:position',
                label: 'What is your position at the hospital?',
                placeholder: 'Surgeon',
                required: true,
              },
              {
                type: 'custom:years_experience',
                label: 'Please specify the number of years you have been working as a medical doctor.',
                placeholder: '5',
                required: true,
              },
              {
                type: 'password',
                label: 'Please create a password',
                placeholder: '********',
                required: true,
              },
            ]}
          />
          {children}
        </>
      )}
    </Authenticator>
  );
};

export default CustomAuthenticator;

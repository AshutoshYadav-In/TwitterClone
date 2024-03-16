import * as Yup from 'yup';

export const signupSchema = Yup.object().shape({
    name: Yup.string().required('Name is required').max(20, 'Name must be at most 20 characters'),
    username: Yup.string().required('Username is required').max(20, 'Username must be at most 20 characters'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .max(100, 'Password must be at most 100 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
            'Password must contain at least 6 characters, one uppercase, one lowercase, one number, and one special character'
        ),
    confirmpassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
});


export const signinSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
})

export const editProfileSchema = (isChecked) => {
    return Yup.object().shape({
        name: Yup.string().required('Name is required').max(20, 'Name must be at most 20 characters'),
        bio: Yup.string().required('Bio is required').max(100, 'Bio must be at most 100 characters'),
        ...(isChecked && {
            password: Yup.string()
                .required('Password is required')
                .min(6, 'Password must be at least 6 characters')
                .max(100, 'Password must be at most 100 characters')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    'Password must contain at least 6 characters, one uppercase, one lowercase, one number, and one special character'
                ),
            confirmpassword: Yup.string()
                .required('Confirm password is required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .min(6, 'Confirm password must be at least 6 characters')
                .max(100, 'Confirm password must be at most 100 characters')
        })
    });
};

export const tweetValidationSchema = Yup.object().shape({
  tweetText: Yup.string()
    .required('Tweet text is required')
    .max(200, 'Maximum 200 words allowed')
});

import React, { useRef, useState } from 'react'
import classes from './AuthPage.module.css'
import { useAuth } from '../../hooks/zustand/useAuth'
import Page from '../../components/shared/Page'
import { Button, TextInput, Text, Title } from '@mantine/core'
import useModalContext from '../../hooks/contexts/modal/useModalContext'
import { useNavigate } from 'react-router-dom'

const AuthPage = (): JSX.Element => {

    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const { signIn, signOut, isAuthenticated, username } = useAuth()
    const { dispatch } = useModalContext()


    const handleClick = async () => {
        const uname = usernameRef.current;
        const password = passwordRef.current;
        if(uname && password){
            try{
                await signIn({
                    username: uname.value,
                    password: password.value
                })
            }catch(err){
                uname.value = '';
                password.value = '';
                dispatch({ 
                    type: 'SHOW_ERROR_MODAL', 
                    title: 'Authentication Error',
                    body: 'The credentials you provided are invalid'
                })
            }
        }
    }

    return (
        <Page className={classes.container}>
            { isAuthenticated ? 
                <form className={classes.logoutForm}>
                    <Title order={3}
                        style={{ color: '#fff' }}
                    >Logged in as {username}
                    </Title>
                    <Button size='lg'
                        style={{ width: '100%', marginTop: '1vh' }}
                        onClick={signOut}
                    >Sign out</Button>
                </form> :
                <form className={classes.loginForm}>
                    <TextInput size='lg'
                        style={{ marginBottom: '.5em' }}
                        ref={usernameRef} 
                        placeholder='Username' 
                        label='Username'
                        labelProps={{ style: { color: '#fff' } }}
                    />
                    <TextInput size='lg'
                        style={{ marginBottom: '1.5em' }}
                        ref={passwordRef}
                        placeholder='Password' 
                        label='Password'
                        labelProps={{ style: { color: '#fff' } }}
                    />
                    <Button size='lg'
                        style={{ width: '100%' }}
                        onClick={handleClick}
                    >
                        Sign in
                    </Button>
                </form>
            }
        </Page>
    )
}

export default AuthPage;
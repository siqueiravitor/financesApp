import React from 'react'
import { Feather } from '@expo/vector-icons'; 
import { useNavigation, DrawerActions } from '@react-navigation/native'

import { Container, ButtonMenu } from './styles'

export default function Header() {
    const navigation = useNavigation();

    return (
        <Container>
            <ButtonMenu onPress={() => navigation.dispatch(DrawerActions.openDrawer()) }>
                <Feather name='menu' color='#FFF' size={30} />
            </ButtonMenu>
        </Container>
    )
}


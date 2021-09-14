import React, { useContext } from 'react'
import { View, Text, Image, Dimensions } from 'react-native'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { AuthContext } from '../../contexts/auth'

export default function CustomDrawer(props) {
    const { user, signOut } = useContext(AuthContext);
    const windowHeight = Dimensions.get('window').height;

    return (
        <View {...props}>
            <View style={{ height: windowHeight - 10 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>
                    <Image 
                        source={require('../../assets/Logo.png')}
                        style={{width: 85, height: 85}}
                        resizeMode="contain"
                    />

                    <Text style={{ color: '#FFF', fontSize: 18, marginTop: 5}}>
                        Bem-vindo
                    </Text>
                    <Text style={{ color: '#FFF', fontSize: 17, fontWeight: 'bold', paddingBottom: 25}}>
                        {user.nome}
                    </Text>
                </View>
                <DrawerItemList {...props}/>
            </View>


            <View>
                <DrawerItem 
                    {...props}
                    label="Sair do app"        
                    // inactiveBackgroundColor="#c62c36"    
                    inactiveTintColor="#fff"
                    onPress={()=> signOut()}
                    style={{ borderTopWidth: 1, borderTopColor: "#bbb" }}
                />
            </View>

        </View>
    )
}

import React from 'react'
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { initCap } from './utils';

const DocuPdf = ({information}) => {
    const currentDate = new Date();
    // const information = {
    //     first_name: 'Bob',
    //     last_name: 'Pantalones',
    //     last_name_2: 'Cuadrados',
    //     rut: '12.345.678-8',
    //     jv_name: 'magallanes',
    //     formatedAddress: 'comuna de Pedro Aguirre Cerda, Región Metropolitana de Santiago',
    //     user_first_name: 'Patricio',
    //     user_last_name: 'Estrella',
    //     user_last_name_2: 'Estrella2',
    //     user_rut: '99.999.999-9',
    //     user_address: 'Av fondo de bikini 4231',
    //     commune_name: 'Pedro Aguirre Cerda'
    // };

    const monthNames = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    return (
        <Document>
            <Page size="A4">

                <View style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '50px',
                    height: '100%',
                    gap: '50px',
                    fontSize: '16px'
                    }}>
                    <Text style={{ color: '#333333', fontSize: '20px'}}>Certificado de Residencia</Text>

                    <Text style={{ width: '100%', textAlign: 'justify'}}>{initCap(information.first_name)} {initCap(information.last_name)} {initCap(information.last_name_2)},
                    Rut {information.rut}, Presidente de la Junta de Vecinos {initCap(information.jv_name)}, ubicada en {information.formatedAddress},
                    ; Certifica que Don (a) {initCap(information.user_first_name)} {initCap(information.user_last_name)} {initCap(information.user_last_name_2)}
                    , Rut {information.user_rut}, reside en {information.user_address}.
                    </Text>
                    <Text style={{ width: '100%', textAlign: 'justify'}}>
                        Se extiende el presente certificado a petición del interesado, para los fines que estime convenientes, sin ulterior
                        responsabilidad para esta organización.
                    </Text>
                    <Text style={{ width: '100%', textAlign: 'left'}}>JUNTA DE VECINOS {information.jv_name.toUpperCase()}</Text>

                    <Text style={{ width: '100%', textAlign: 'left'}}>{initCap(information.commune_name)}, {currentDate.getDay()} de {initCap(monthNames[currentDate.getMonth()])} de {currentDate.getFullYear()}</Text>
                    
                    {/* <Image src={'/capstoneApp/src/assets/images/sign.png'} style={{ height: '100px'}}></Image> */}
                    <Text style={{ borderTop: '2px solid black', width: '200px', textAlign: 'right'}}>FIRMA</Text>
                </View>            
            </Page>
    
        </Document>
    )
}

export default DocuPdf
json.data do
    json.user do    
        json.id @user.id
        json.username @user.username
        json.video 'test de texto'
        json.last_name 'asdsaddsasad'
    end
end


#doorkeeper para autenticar usuarios y solo estos usen la API
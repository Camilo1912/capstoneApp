export function UserRols(rol) {
    if (rol === 5) {
        return '/admin_home';
    } else if (rol === 2) {
        return '/president_home';
    } else if (rol === 3) {
        return '/secretary_home';
    } else if (rol === 4){
        return '/treasurer_home';
    } else if (rol === 1){
        return '/neighbor_home';
    } else {
        return '/';
    }
}
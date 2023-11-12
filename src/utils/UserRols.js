export function UserRols(rol) {
    if (rol === 5) {
        return '/admin_home';
    } else if (rol === 2) {
        return '/directive_home';
    } else if (rol === 3) {
        return '/directive_home';
    } else if (rol === 4){
        return '/directive_home';
    } else if (rol === 1){
        return '/neighbor_home';
    } else {
        return '/';
    }
}
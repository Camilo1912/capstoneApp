export function UserRols(rol) {
    if (rol === 'ADMIN') {
        return '/admin_home';
    } else if (rol === 'PRESIDENT') {
        return '/president_home';
    } else if (rol === 'SECRETARY') {
        return '/secretary_home';
    } else if (rol === 'TREASURER'){
        return '/treasurer_home';
    } else if (rol === 'NEIGHBOR'){
        return '/neighbor_home';
    } else {
        return '/';
    }
}
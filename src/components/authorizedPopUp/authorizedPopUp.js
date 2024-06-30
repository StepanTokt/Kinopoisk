import styles from '../../styles/authorizedPopUp.module.css';
import { useEffect, useState } from 'react';
import { useLoginUserMutation } from '../api/apiUsers';

export default function AuthorizedPopUp({ active, setActive }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginUser, { isLoading, isError }] = useLoginUserMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
            localStorage.removeItem('marks');
        } else {
            const { data } = await loginUser({ username, password });
            if (data) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('marks', JSON.stringify({}));
                setActive(false);
                window.location.reload(); 
            }
        }
        
    };
    const handleClose = () => {
        setPassword('');
        setUsername('');
        setActive(false);
        if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
            localStorage.removeItem('marks');
        }
    };

    useEffect(() => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (active) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }
    }, [active]);

    return (
        <div
            className={active ? `${styles.modal_section} ${styles.active}` : styles.modal_section}
            onClick={() => setActive(false)}
        >
            <div
                className={active ? `${styles.pop_up} ${styles.modal_block} ${styles.active}` : `${styles.pop_up} ${styles.modal_block}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header_pop_up}>
                    <a className={styles.pop_up__title}>Авторизация</a>
                    <svg
                        onClick={() => setActive(false)}
                        width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9.85372 9.14625C9.90018 9.19271 9.93703 9.24786 9.96217 9.30856C9.98731 9.36925 10.0003 9.43431 10.0003 9.5C10.0003 9.5657 9.98731 9.63076 9.96217 9.69145C9.93703 9.75215 9.90018 9.8073 9.85372 9.85375C9.80727 9.90021 9.75212 9.93706 9.69142 9.9622C9.63072 9.98734 9.56567 10.0003 9.49997 10.0003C9.43428 10.0003 9.36922 9.98734 9.30853 9.9622C9.24783 9.93706 9.19268 9.90021 9.14622 9.85375L4.99997 5.70688L0.853723 9.85375C0.759902 9.94757 0.632655 10.0003 0.499973 10.0003C0.367291 10.0003 0.240043 9.94757 0.146223 9.85375C0.0524025 9.75993 -0.000305173 9.63269 -0.000305176 9.5C-0.000305178 9.36732 0.0524025 9.24007 0.146223 9.14625L4.2931 5L0.146223 0.853753C0.0524025 0.759933 -0.000305176 0.632685 -0.000305176 0.500003C-0.000305176 0.367321 0.0524025 0.240074 0.146223 0.146253C0.240043 0.052433 0.367291 -0.000274658 0.499973 -0.000274658C0.632655 -0.000274658 0.759902 0.052433 0.853723 0.146253L4.99997 4.29313L9.14622 0.146253C9.24004 0.052433 9.36729 -0.000274661 9.49997 -0.000274658C9.63266 -0.000274656 9.7599 0.052433 9.85372 0.146253C9.94754 0.240074 10.0003 0.367321 10.0003 0.500003C10.0003 0.632685 9.94754 0.759933 9.85372 0.853753L5.70685 5L9.85372 9.14625Z"
                            fill="#ABABAB"
                        />
                    </svg>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.legend}>
                        <legend className={styles.login_legend}>Логин</legend>
                        <svg
                            width="5"
                            height="6"
                            viewBox="0 0 5 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4.55078 4.42871L2.88281 3.34863L2.99219 5.32422H2.0625L2.17188 3.3418L0.503906 4.42871L0.0458984 3.63574L1.82324 2.74023L0.0458984 1.83789L0.503906 1.03125L2.17188 2.14551L2.0625 0.135742H2.99219L2.88281 2.14551L4.55078 1.03125L5.00879 1.83789L3.23828 2.74023L5.00879 3.63574L4.55078 4.42871Z"
                                fill="#F04075"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className={styles.login_input}
                        placeholder="Введите логин"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <div className={styles.legend}>
                        <legend className={styles.password_legend}>Пароль</legend>
                        <svg
                            width="5"
                            height="6"
                            viewBox="0 0 5 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4.55078 4.42871L2.88281 3.34863L2.99219 5.32422H2.0625L2.17188 3.3418L0.503906 4.42871L0.0458984 3.63574L1.82324 2.74023L0.0458984 1.83789L0.503906 1.03125L2.17188 2.14551L2.0625 0.135742H2.99219L2.88281 2.14551L4.55078 1.03125L5.00879 1.83789L3.23828 2.74023L5.00879 3.63574L4.55078 4.42871Z"
                                fill="#F04075"
                            />
                        </svg>
                    </div>
                    <input
                        type="password"
                        className={styles.password_input}
                        placeholder="Введите пароль"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className={styles.buttons}>
                        <button type="submit" className={`${styles.enter_button} ${styles.enter_pop_up}`} disabled={isLoading}>
                            Войти
                        </button>
                        <button onClick={handleClose} className={styles.cancel_button}>
                            Отменить
                        </button>
                    </div>

                    {isError && <p className={styles.error_message}>Неверный логин или пароль!</p>}
                </form>
            </div>
        </div>
    );
}

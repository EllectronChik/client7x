import { LOCALES } from "./locales";

export const MESSAGES = {
    [LOCALES.ENGLISH]: {
        header_statistic: 'Statistic',
        header_archive: 'Archive',
        header_login: 'Join',
        header_account: 'My account',
        logout: 'Logout',
        search: 'Search',
        clanTag_tooltip: 'Enter a clan tag and the system will try to find players from your clan. {br} Please make sure you respect case and layout when entering the tag',
        API_mention: 'We use the {inLink} API',
        enter_clan_data: 'Enter clan data:',
        tag: 'Tag:',
        name: 'Name:',
        region: 'Region:',
        logo: 'Logo:',
        clan_media: "You can also add links to your clan's media (Twitter, Facebook, Instagram etc.):",
        required_field: "This field is required",
        drop_logo: "Drop logo here",
        add_logo: "Add logo",
        select_region: "Select region",
        add_media: "Click here to add media",
        select_only_active_players: "Select only the players who will participate in the leagues",  
        clan_exists: "Clan with tag {tag} already exists",      
        server_do_not_respond: "Server does not respond",
        add_player_manually: "If any of your players are not on the list, you can add them manually",
        did_not_find_clan: "The system did not find a clan with this tag :( {br} If you are sure you entered the tag correctly, {br} please add players manually",
        add_player: "Add player",
        return: "Return",
        select_race: "Select race",
        zerg: "Zerg",
        terran: "Terran",
        protoss: "Protoss",
        random: "Random",
        player: "Player",
        username: "Username",
        email: "Email",
        password: "Password",
        re_password: "Repeat password",
        select_acc_region: "Select account region",
        media: "Media",
        sign_up: "Sign up",
        sign_in: "Sign in",
        perform_register_message: "Important: ONLY the team manager or a member of the administration should register",
        selected_players: "Selected players",
        clear_selected: "Clear selected",
        submit: "Submit",
        team: "Team",
        staff: "Staff panel",
        accept: "Accept",
        decline: "Decline",
        no_seasons: "There's no season going on right now. You can start a new one by specifying its start time and clicking the button below.",
        start_time: "Specify the start time",
        open_registration: "Оpen registration",
        tournament_start: "Tournament Start Time",
        finish_tournament: "Finish the tournament",
        yes: "Yes",
        no: "No",
        confirm_finish: "Are you sure you want to finish the tournament?",
        manage_started_season: "Season {season}",
        create_team: "Create team",
        return_to_staff_page: "Return to administration panel",
        account: "Account",
        team_manage: "Team Manage",
        tournamentStartMessage: "The {number} tournament starts on {date} at {time}. You can apply for participation in it.",
        participate: "Participate",
        day_single: "day",
        day_few: "days",
        day_plural: "days",
        hour_single: "hour",
        hour_few: "hours",
        hour_plural: "hours",
        minute_single: "minute",
        minute_few: "minutes",
        minute_plural: "minutes",
        second_single: "second",
        second_few: "seconds",
        second_plural: "seconds",
        tourStartMessage: "There are {time} left until the start of season {season}"

    },
    [LOCALES.RUSSIAN]: {
        header_statistic: 'Статистика',
        header_archive: 'Архив',
        header_login: 'Войти',
        header_account: 'Мой аккаунт',
        logout: 'Выйти',
        search: 'Найти',
        clanTag_tooltip: 'Введите тег клана, и система попытается найти игроков из вашего клана. {br} Пожалуйста, при вводе тега соблюдайте регистр и раскладку',
        API_mention: 'Мы используем {inLink} API',
        enter_clan_data: 'Введите данные клана:',
        tag: 'Тег:',
        name: 'Название:',
        region: 'Регион:',
        logo: 'Логотип:',
        clan_media: "Вы также можете добавить ссылки на медиа вашего клана (Twitter, Facebook, Instagram и т.д.):",
        required_field: "Это поле обязательно для заполнения",
        drop_logo: "Отпустите логотип",
        add_logo: "Добавить логотип",
        select_region: "Выберите регион",
        add_media: "Нажмите, чтобы добавить медиа",
        select_only_active_players: "Выберите только игроков, которые будут участвовать в лигах",
        clan_exists: "Клан с тегом {tag} уже существует",
        server_do_not_respond: "Сервер не отвечает",
        add_player_manually: "Если какие-либо из ваших игроков не в списке, вы можете их добавить вручную",
        did_not_find_clan: "Система не нашла клан с таким тегом :( {br} Если вы уверены, что ввели тег правильно, пожалуйста, {br} добавьте игроков вручную",
        add_player: "Добавить игрока",
        return: "Вернуться",
        select_race: "Выберите расу",
        zerg: "Зерг",
        terran: "Терран",
        protoss: "Протосс",
        random: "Рандом",
        player: "Игрок",
        username: "Никнейм",
        email: "Почта",
        password: "Пароль",
        re_password: "Повторите пароль",
        select_acc_region: "Выберите регион аккаунта",
        media: "Медиа",
        sign_up: "Зарегистрироваться",
        sign_in: "Войти",
        perform_register_message: "Важно: Регистрироваться должен только менеджер команды или член администрации",
        selected_players: "Выбранные игроки",
        clear_selected: "Очистить выбранные",
        submit: "Создать",
        team: "Клан",
        staff: "Панель администратора",
        accept: "Принять",
        decline: "Отклонить",
        no_seasons: "В данный момент сезон не проводится. Вы можете начать новый, указав время его начала и нажав кнопку ниже.",
        start_time: "Укажите время начала",
        open_registration: "Открыть регистрацию",
        tournament_start: "Время начала турнира",
        finish_tournament: "Завершить турнир",
        yes: "Да",
        no: "Нет",
        confirm_finish: "Вы уверены, что хотите завершить турнир?",
        manage_started_season: "Сезон {season}",
        create_team: "Создать команду",
        return_to_staff_page: "Вернуться в панель администратора",
        account: "Аккаунт",
        team_manage: "Управление командой",
        tournamentStartMessage:"{date} в {time} стартует турнир {number}. Вы можете подать заявку на участие в нем.",
        participate: "Участвовать",
        day_single: "день",
        day_few: "дня",
        day_plural: "дней",
        hour_single: "час",
        hour_few: "часа",
        hour_plural: "часов",
        minute_single: "минута",
        minute_few: "минуты",
        minute_plural: "минут",
        second_single: "секунда",
        second_few: "секунды",
        second_plural: "секунд",
        tourStartMessage: "До начала турнира {season} осталось {time}",

    },
    [LOCALES.UKRAINIAN]: {
        header_statistic: 'Статистика',
        header_archive: 'Архів',
        header_login: 'Увійти',
        header_account: 'Мій аккаунт',
        logout: 'Вийти',
        search: 'Пошук',
        clanTag_tooltip: 'Введіть тег клану, і система спробує знайти гравців з вашого клану. {br} Будь ласка, переконайтеся, що ви дотримуєтеся регістру та розкладки при введенні тегу',
        API_mention: 'Ми використовуємо {inLink} API',
        enter_clan_data: 'Введіть дані клану:',
        tag: 'Тег:',
        name: 'Назва:',
        region: 'Регіон:',
        logo: 'Логотип:',
        clan_media: "Ви також можете додати посилання на медіа вашого клану (Twitter, Facebook, Instagram та т.д.):",
        required_field: "Це поле є обов'язковим для заповнення",
        drop_logo: "Вилучіть логотип",
        add_logo: "Додати логотип",
        select_region: "Виберіть регіон",
        add_media: "Натисніть, щоб додати медіа",
        select_only_active_players: "Виберіть тільки гравців, якими буде учасниками лиг",
        clan_exists: "Клан з тегом {tag} вже існує",
        server_do_not_respond: "Сервер не відповідає",
        add_player_manually: "Якщо жоден з ваших гравців не знаходиться в списку, ви можете його додати вручну",
        did_not_find_clan: "Система не знайшла клан з цим тегом :( {br} Якщо ви впевнені, що ввели тег правильно, будь ласка, {br} додайте гравців вручну",
        add_player: "Додати гравця",
        return: "Повернутися",
        select_race: "Виберіть расу",
        zerg: "Зерг",
        terran: "Терран",
        protoss: "Протосс",
        random: "Рандом",
        player: "Гравець",
        username: "Никнейм",
        email: "Пошта",
        password: "Пароль",
        re_password: "Повторіть пароль",
        select_acc_region: "Виберіть регіон аккаунта",
        media: "Медіа",
        sign_up: "Зареєструватися",
        sign_in: "Увійти",
        perform_register_message: "Важливо: Реєструватися повинен тільки менеджер команди або член адміністрації",
        selected_players: "Вибрані гравці",
        clear_selected: "Очистити вибрані",
        submit: "Створити",
        team: "Клан",
        staff: "Панель адміністратора",
        accept: "Прийняти",
        decline: "Відхилити",
        no_seasons: "Наразі сезон не проводиться. Ви можете почати новий, вказавши час початку і натиснувши на кнопку нижче",
        start_time: "Вкажіть час початку",
        open_registration: "Відкрити реєстрацію",
        tournament_start: "Час початку турніру",
        finish_tournament: "Завершити турнір",
        yes: "Так",
        no: "Ні",
        confirm_finish: "Ви впевнені, що хочете завершити турнір?",
        manage_started_season: "Сезон {season}",
        create_team: "Створити команду",
        return_to_staff_page: "Повернутися до панелі адміністратора",
        account: "Аккаунт",
        team_manage: "Управління командою",
        tournamentStartMessage:"{date} у {time} стартує турнір {number}. Ви можете подати заявку на участь у ньому.",
        participate: "Участвувати",
        day_single: "день",
        day_few: "дні",
        day_plural: "днів",
        hour_single: "година",
        hour_few: "години",
        hour_plural: "годин",
        minute_single: "хвилина",
        minute_few: "хвилини",
        minute_plural: "хвилин",
        second_single: "секунда",
        second_few: "секунди",
        second_plural: "секунд",
        tourStartMessage: "Залишилося {time} до початку сезону {season}",
    }
}
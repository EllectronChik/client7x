import { LOCALES } from "./locales";

export const MESSAGES = {
  [LOCALES.ENGLISH]: {
    statistic: "Statistics",
    archive: "Archive",
    login: "Join",
    myAccount: "My account",
    logout: "Logout",
    search: "Search",
    clanTagTooltip:
      "Enter a clan tag and the system will try to find players from your clan. {br} Please make sure you respect case and layout when entering the tag",
    apiMention: "We use the {inLink} API",
    enterClanData: "Enter clan data:",
    tag: "Tag:",
    name: "Name:",
    region: "Region:",
    logo: "Logo:",
    clanMedia:
      "You can also add links to your clan's media (Twitter, Facebook, Instagram etc.):",
    requiredField: "This field is required",
    dropLogo: "Drop logo here",
    addLogo: "Add logo",
    selectRegion: "Select region",
    addMedia: "Click here to add media",
    selectOnlyActivePlayers:
      "Select only the players who will participate in the leagues",
    clanExists: "Clan with tag {tag} already exists",
    serverDoNotRespond: "Server does not respond",
    addPlayerManually:
      "If any of your players are not on the list, you can add them manually",
    didNotFindClan:
      "The system did not find a clan with this tag :( {br} If you are sure you entered the tag correctly, {br} please add players manually",
    addPlayer: "Add player",
    return: "Return",
    selectRace: "Select race",
    zerg: "Zerg",
    terran: "Terran",
    protoss: "Protoss",
    random: "Random",
    player: "Player",
    username: "Username",
    email: "Email",
    password: "Password",
    re_password: "Repeat password",
    selectAccRegion: "Select account region",
    media: "Media",
    signUp: "Sign up",
    signIn: "Sign in",
    performRegisterMessage:
      "Important: ONLY the team manager or a member of the administration should register",
    selectedPlayers: "Selected players",
    clearSelected: "Clear selected",
    submit: "Submit",
    team: "Team",
    staff: "Staff panel",
    accept: "Accept",
    decline: "Decline",
    noSeasons:
      "There's no season going on right now. You can start a new one by specifying its start time and clicking the button below.",
    start_time: "Specify the start time",
    openRegistration: "Оpen registration",
    tournamentStart: "Tournament Start Time",
    finishTournament: "Finish the tournament",
    yes: "Yes",
    no: "No",
    confirm_finish: "Are you sure you want to finish the tournament?",
    manageStartedSeason: "Season {season}",
    createTeam: "Create team",
    returnToStaffPage: "Return to administration panel",
    account: "Account",
    team_manage: "Team Manage",
    tournamentStartMessage:
      "The {number} tournament starts on {date} at {time}. You can apply for participation in it.",
    participate: "Participate",
    daySingle: "day",
    dayFew: "days",
    dayPlural: "days",
    hourSingle: "hour",
    hourFew: "hours",
    hourPlural: "hours",
    minuteSingle: "minute",
    minuteFew: "minutes",
    minutePlural: "minutes",
    secondSingle: "second",
    secondFew: "seconds",
    secondPlural: "seconds",
    tourStartMessage:
      "There are {time} left until the start of season {season} Wait for the administrator to determine the order of your games",
    totalGames: "Total games",
    totalPlayers: "Total players",
    wins: "Wins",
    onParticipantsNotEmpty:
      "Season participants {br} (Click on a player to delete them)",
    undistributedTeams: "Undistributed teams",
    groupStageDistribution: "Grouping of teams for the group stage",
    group: "Group",
    stage: "Stage",
    groupSingle: "group",
    groupPlural: "groups",
    addGroup: "Add group",
    randomizeGroups: "Randomize groups",
    randomizeMessage:
      "You can randomly assign teams to {count} {groups} or do it manually by dragging and dropping teams",
    groupsCount: "Groups count",
    selectTeam: "Select team",
    reset: "Reset",
    addStage: "Add a stage",
    addMatch: "Add a new match",
    groupStageCompleteMessage:
      "Looks like you've played all the group stage games. Wait for the grid to be determined.",
    selectPlayerLabel: "Select player",
    mapLabel: "Map",
    selectWinnerLabel: "Select winner",
    opponentFinishConfirmationMessage:
      'The opponent pressed the "Finish" button. Clicking the button below will end the match and you will not be able to edit it yourself.',
    yourFinishConfirmationMessage:
      'You have clicked the "Finish" button. Wait for your opponent or admin to confirm the end of the match.',
    finishedTournamentsTitle: "Finished tournaments",
    currentTournamentsTitle: "Current tournaments",
    matchResultsTitle: "Match results",
    upcomingTournamentsTitle: "Upcoming tournaments",
    tournaments: "Tournaments",
    opponentLabel: "Opponent",
    startTimeLabel: "Start time",
    startEarlyLabel: "Start early",
    finish: "Finish",
    tournamentProgressTitle: "Tournament management",
    adminPanelFeatures: "Admin panel features:",
    teamCompletedStatusDescription:
      'By clicking on a team name, you will set the "Completed" status for the tournament and give the specified team a winner status.',
    playerWinnerStatusDescription:
      "By clicking on a player's name you will give them the status of the winner of the match.",
    endGameAndDeclareWinnerDescription:
      'By clicking on the "Completed" checkbox you will end the game and also give the winner status to the team with the most points. {br} If the score is zero, the winner must be selected manually.',
    editMatchModeDescription:
      "By clicking on the {edit} symbol you will go to the match editing mode and you will be able to change the players and the map name.",
    deleteMatchDescription:
      "By clicking on the {delete} symbol you will delete the match.",
    groupStage: "Group stage",
    completed: "Completed",
    grid: "Grid",
    playoff: "Play-Off",
    mapUnspecified: "Map unspecified",
    specifyGrid: "Specify the number of stages in the grid:",
    thirdPlace: "Third place match",
    final: "Final",
    starcraftTrademark: "StarCraft II: Legacy of the Void trademark",
    bitmapOwnership: "as well as some of the bitmaps are",
    blizzardOwnership: "owned by",
    language: "Language",
    seasonIsNowUnderway: "Season {num} is now underway",
    previousSeasons: "Previous seasons",
    registerTeam: "Register your team and participate in upcoming tournaments!",
    showMore: "Show more",
    winner: "Winner",
    games: "Games",
    players: "Players",
    playersCnt: "Players",
    noTournaments: "There are no tournaments at this time",
    registrationOpen: "Registration is now open for the {season}",
    switchToParticipate: "Switch to your account to participate",
    signupToParticipate: "Register your team to participate",
    signinToParticipate: "Sign in to your account to participate",
    season: "Season",
    seasons: "Seasons",
    teamsParticipating: "Number of teams participating",
    otherLeagues: "Other leagues",
    mirrors: "Mirrors",
    teams: "Teams",
    gridNotDetermined: "The tournament grid has not yet been determined",
    score: "Score",
    date: "Date",
    teamManager: "Team manager",
    managerContacts: "Manager contacts",
    matches: "Matches",
    result: "Result",
    win: "Win",
    lose: "Lose",
    enterManagerContacts: "Enter the contacts of the team manager/s",
    enterClanTag: "Enter clan tag",
    enterClanName: "Enter clan name",
    enterLink: "Enter the link",
    removePlayerLabel: "Click to remove a player",
    addPlayerLabel: "Click to add a player",
    addPlayers: "Add players",
    editLinks: "Edit Links",
    clickOnPlayer: "Click on a player to add them",
    newPlayerAvatars:
      "New player avatars usually load within 24 hours, but some don't load due to Blizzard API errors",
    teamResources: "Team resources",
    linkTitle: "Link title",
    link: "Link",
    addResource: "Add resource",
    addContact: "Add contact",
    clickOnPlayerToTournament:
      "Click on a player in the player list to add them to the tournament roster",
    clickOnPlayerToRemove:
      "Click on a player in the player list below to remove them from the tournament roster",
    clickOnPlayerToAdd:
      "Click on a player to add them to the tournament roster",
  },
  [LOCALES.RUSSIAN]: {
    statistic: "Статистика",
    archive: "Архив",
    login: "Войти",
    myAccount: "Мой аккаунт",
    logout: "Выйти",
    search: "Найти",
    clanTagTooltip:
      "Введите тег клана, и система попытается найти игроков из вашего клана. {br} Пожалуйста, при вводе тега соблюдайте регистр и раскладку",
    apiMention: "Мы используем {inLink} API",
    enterClanData: "Введите данные клана:",
    tag: "Тег:",
    name: "Название:",
    region: "Регион:",
    logo: "Логотип:",
    clanMedia:
      "Вы также можете добавить ссылки на медиа вашего клана (Twitter, Facebook, Instagram и т.д.):",
    requiredField: "Это поле обязательно для заполнения",
    dropLogo: "Отпустите логотип",
    addLogo: "Добавить логотип",
    selectRegion: "Выберите регион",
    addMedia: "Нажмите, чтобы добавить медиа",
    selectOnlyActivePlayers:
      "Выберите только игроков, которые будут участвовать в лигах",
    clanExists: "Клан с тегом {tag} уже существует",
    serverDoNotRespond: "Сервер не отвечает",
    addPlayerManually:
      "Если какие-либо из ваших игроков не в списке, вы можете их добавить вручную",
    didNotFindClan:
      "Система не нашла клан с таким тегом :( {br} Если вы уверены, что ввели тег правильно, пожалуйста, {br} добавьте игроков вручную",
    addPlayer: "Добавить игрока",
    return: "Вернуться",
    selectRace: "Выберите расу",
    zerg: "Зерг",
    terran: "Терран",
    protoss: "Протосс",
    random: "Рандом",
    player: "Игрок",
    username: "Никнейм",
    email: "Почта",
    password: "Пароль",
    re_password: "Повторите пароль",
    selectAccRegion: "Выберите регион аккаунта",
    media: "Медиа",
    signUp: "Зарегистрироваться",
    signIn: "Войти",
    performRegisterMessage:
      "Важно: Регистрироваться должен только менеджер команды или член администрации",
    selectedPlayers: "Выбранные игроки",
    clearSelected: "Очистить выбранные",
    submit: "Создать",
    team: "Клан",
    staff: "Панель администратора",
    accept: "Принять",
    decline: "Отклонить",
    noSeasons:
      "В данный момент сезон не проводится. Вы можете начать новый, указав время его начала и нажав кнопку ниже.",
    start_time: "Укажите время начала",
    openRegistration: "Открыть регистрацию",
    tournamentStart: "Время начала турнира",
    finishTournament: "Завершить турнир",
    yes: "Да",
    no: "Нет",
    confirm_finish: "Вы уверены, что хотите завершить турнир?",
    manageStartedSeason: "Сезон {season}",
    createTeam: "Создать команду",
    returnToStaffPage: "Вернуться в панель администратора",
    account: "Аккаунт",
    team_manage: "Управление командой",
    tournamentStartMessage:
      "{date} в {time} стартует турнир {number}. Вы можете подать заявку на участие в нем.",
    participate: "Участвовать",
    daySingle: "день",
    dayFew: "дня",
    dayPlural: "дней",
    hourSingle: "час",
    hourFew: "часа",
    hourPlural: "часов",
    minuteSingle: "минута",
    minuteFew: "минуты",
    minutePlural: "минут",
    secondSingle: "секунда",
    secondFew: "секунды",
    secondPlural: "секунд",
    tourStartMessage:
      "До начала турнира {season} осталось {time} Ожидайте, пока администратор определит порядок ваших игр.",
    totalGames: "Всего игр",
    totalPlayers: "Всего игроков",
    wins: "Побед",
    onParticipantsNotEmpty:
      "Участники сезона {br} (Нажмите на игрока чтобы удалить его)",
    undistributedTeams: "Нераспределенные команды",
    groupStageDistribution: "Распределение команд для группового этапа",
    group: "Группа",
    stage: "Этап",
    groupSingle: "группe",
    groupPlural: "группам",
    addGroup: "Добавить группу",
    randomizeGroups: "Рандомизировать группы",
    randomizeMessage:
      "Вы можете случайным образом распределить команды по {count} {groups} или сделать это вручную, перетаскивая команды.",
    groupsCount: "Количество групп",
    selectTeam: "Выберите команду",
    reset: "Сброс",
    addStage: "Добавить этап",
    addMatch: "Добавить матч",
    groupStageCompleteMessage:
      "Похоже, вы сыграли все игры группового этапа. Подождите, пока будет определена сетка.",
    selectPlayerLabel: "Выберите игрока",
    mapLabel: "Карта",
    selectWinnerLabel: "Победитель",
    opponentFinishConfirmationMessage:
      'Противник нажал кнопку "Завершить". Нажатие кнопки ниже завершит матч, и вы не сможете его изменить.',
    yourFinishConfirmationMessage:
      'Вы нажали кнопку "Завершить". Подождите подтверждения от вашего противника или администратора для завершения матча.',
    finishedTournamentsTitle: "Завершенные турниры",
    currentTournamentsTitle: "Текущие турниры",
    matchResultsTitle: "Результаты матча",
    upcomingTournamentsTitle: "Предстоящие турниры",
    tournaments: "Турниры",
    opponentLabel: "Противник",
    startTimeLabel: "Время начала",
    startEarlyLabel: "Начать раньше",
    finish: "Завершить",
    tournamentProgressTitle: "Управление турнирами",
    adminPanelFeatures: "Возможности панели администратора:",
    teamCompletedStatusDescription:
      'Нажав на название команды, вы установите статус "Завершено" для турнира и присвоите указанной команде статус победителя.',
    playerWinnerStatusDescription:
      "Нажав на имя игрока, вы присвоите ему статус победителя матча.",
    endGameAndDeclareWinnerDescription:
      'Нажав на флажок "Завершено", вы завершите игру и также присвоите статус победителя команде с наибольшим количеством очков. {br} Если счет равен нулю, победителя следует выбрать вручную.',
    editMatchModeDescription:
      "Нажав на символ {edit}, вы перейдете в режим редактирования матча и сможете изменить игроков и название карты.",
    deleteMatchDescription: "Нажав на символ {delete}, вы удалите матч.",
    groupStage: "Групповой этап",
    completed: "Завершено",
    grid: "Сетка",
    playoff: "Плей-офф",
    mapUnspecified: "Карта не указана",
    specifyGrid: "Укажите количество этапов в сетке:",
    thirdPlace: "Матч за третье место",
    final: "Финал",
    starcraftTrademark: "Торговая марка StarCraft II: Legacy of the Void",
    bitmapOwnership: "а также некоторые растровые изображения",
    blizzardOwnership: "принадлежат компании",
    language: "Язык",
    seasonIsNowUnderway: "Сезон {num} сейчас в процессе",
    previousSeasons: "Предыдущие сезоны",
    registerTeam: "Зарегистрируйте свой клан и участвуйте в будущих турнирах!",
    showMore: "Показать больше",
    winner: "Победитель",
    games: "Игр",
    players: "Игроки",
    playersCnt: "Игроков",
    noTournaments: "В данный момент турниры не проводятся",
    registrationOpen: "Открыта регистрация на участие в сезоне {season}",
    switchToParticipate: "Перейдите в свой аккаунт, чтобы принять участие",
    signupToParticipate: "Зарегестрируйте свою команду, чтобы принять участие",
    signinToParticipate: "Войдите в свой аккаунт, чтобы принять участие",
    season: "Сезон",
    seasons: "Сезоны",
    teamsParticipating: "Количество участвующих команд",
    otherLeagues: "Другие лиги",
    mirrors: "Зеркальных",
    teams: "Команд",
    gridNotDetermined: "Сетка турнира ещё не определена",
    score: "Счёт",
    date: "Дата",
    teamManager: "Менеджер команды",
    managerContacts: "Контакты менеджера",
    matches: "Матчи",
    result: "Результат",
    win: "Победа",
    lose: "Поражение",
    enterManagerContacts: "Введите контакты менеджера/ов команды",
    enterClanTag: "Введите тег клана",
    enterClanName: "Введите название клана",
    enterLink: "Введите ссылку",
    removePlayerLabel: "Нажмите, чтобы удалить игрока",
    addPlayerLabel: "Нажмите, чтобы добавить игрока",
    addPlayers: "Добавить игроков",
    editLinks: "Редактировать ссылки",
    clickOnPlayer: "Нажмите на игрока, чтобы добавить его",
    newPlayerAvatars:
      "Новые аватары игроков обычно загружаются в течение 24 часов, но некоторые не загружаются из-за ошибок API Blizzard",
    teamResources: "Ресурсы команды",
    linkTitle: "Название ссылки",
    link: "Ссылка",
    addResource: "Добавить ресурс",
    addContact: "Добавить контакт",
    clickOnPlayerToTournament:
      "Нажмите на игрока в списке игроков, чтобы добавить его в список участников турнира",
    clickOnPlayerToRemove:
      "Нажмите на игрока в списке игроков ниже, чтобы удалить его из списка участников турнира",
    clickOnPlayerToAdd:
      "Нажмите на игрока, чтобы добавить его в список участников турнира",
  },
  [LOCALES.UKRAINIAN]: {
    statistic: "Статистика",
    archive: "Архів",
    login: "Увійти",
    myAccount: "Мій аккаунт",
    logout: "Вийти",
    search: "Пошук",
    clanTagTooltip:
      "Введіть тег клану, і система спробує знайти гравців з вашого клану. {br} Будь ласка, переконайтеся, що ви дотримуєтеся регістру та розкладки при введенні тегу",
    apiMention: "Ми використовуємо {inLink} API",
    enterClanData: "Введіть дані клану:",
    tag: "Тег:",
    name: "Назва:",
    region: "Регіон:",
    logo: "Логотип:",
    clanMedia:
      "Ви також можете додати посилання на медіа вашого клану (Twitter, Facebook, Instagram та т.д.):",
    requiredField: "Це поле є обов'язковим для заповнення",
    dropLogo: "Вилучіть логотип",
    addLogo: "Додати логотип",
    selectRegion: "Виберіть регіон",
    addMedia: "Натисніть, щоб додати медіа",
    selectOnlyActivePlayers:
      "Виберіть тільки гравців, якими буде учасниками лиг",
    clanExists: "Клан з тегом {tag} вже існує",
    serverDoNotRespond: "Сервер не відповідає",
    addPlayerManually:
      "Якщо будь-які з ваших гравців не в списку, ви можете їх додати вручну",
    didNotFindClan:
      "Система не знайшла клан з цим тегом :( {br} Якщо ви впевнені, що ввели тег правильно, будь ласка, {br} додайте гравців вручну",
    addPlayer: "Додати гравця",
    return: "Повернутися",
    selectRace: "Виберіть расу",
    zerg: "Зерг",
    terran: "Терран",
    protoss: "Протосс",
    random: "Рандом",
    player: "Гравець",
    username: "Никнейм",
    email: "Пошта",
    password: "Пароль",
    re_password: "Повторіть пароль",
    selectAccRegion: "Виберіть регіон аккаунта",
    media: "Медіа",
    signUp: "Зареєструватися",
    signIn: "Увійти",
    performRegisterMessage:
      "Важливо: Реєструватися повинен тільки менеджер команди або член адміністрації",
    selectedPlayers: "Вибрані гравці",
    clearSelected: "Очистити вибрані",
    submit: "Створити",
    team: "Клан",
    staff: "Панель адміністратора",
    accept: "Прийняти",
    decline: "Відхилити",
    noSeasons:
      "Наразі сезон не проводиться. Ви можете почати новий, вказавши час початку і натиснувши на кнопку нижче",
    start_time: "Вкажіть час початку",
    openRegistration: "Відкрити реєстрацію",
    tournamentStart: "Час початку турніру",
    finishTournament: "Завершити турнір",
    yes: "Так",
    no: "Ні",
    confirm_finish: "Ви впевнені, що хочете завершити турнір?",
    manageStartedSeason: "Сезон {season}",
    createTeam: "Створити команду",
    returnToStaffPage: "Повернутися до панелі адміністратора",
    account: "Аккаунт",
    team_manage: "Управління командою",
    tournamentStartMessage:
      "{date} у {time} стартує турнір {number}. Ви можете подати заявку на участь у ньому.",
    participate: "Участвувати",
    daySingle: "день",
    dayFew: "дні",
    dayPlural: "днів",
    hourSingle: "година",
    hourFew: "години",
    hourPlural: "годин",
    minuteSingle: "хвилина",
    minuteFew: "хвилини",
    minutePlural: "хвилин",
    secondSingle: "секунда",
    secondFew: "секунди",
    secondPlural: "секунд",
    tourStartMessage:
      "Залишилося {time} до початку сезону {season} Дочекайтеся, поки адміністратор визначить порядок ваших ігор",
    totalGames: "Всього ігор",
    totalPlayers: "Всього гравців",
    wins: "Перемог",
    onParticipantsNotEmpty:
      "Учасники сезону {br} (Натисніть на гравця, щоб видалити його)",
    undistributedTeams: "Нерозподілені команди",
    groupStageDistribution: "Розподіл команд для групового етапу",
    group: "Група",
    stage: "Етап",
    groupSingle: "групою",
    groupPlural: "групами",
    addGroup: "Додати групу",
    randomizeGroups: "Рандомізувати групи",
    randomizeMessage:
      "Ви можете випадковим чином призначити команди до {count} {groups} або зробити це вручну, перетягнувши команди",
    groupsCount: "Кількість груп",
    selectTeam: "Виберіть команду",
    reset: "Скинути",
    addStage: "Додати етап",
    addMatch: "Додати матч",
    groupStageCompleteMessage:
      "Схоже, ви зіграли всі ігри групового етапу. Зачекайте на визначення сітки.",
    selectPlayerLabel: "Оберіть гравця",
    mapLabel: "Карта",
    selectWinnerLabel: "Переможець",
    opponentFinishConfirmationMessage:
      'Суперник натиснув кнопку "Завершити". Натискання кнопки нижче завершить гру, і ви не зможете редагувати її самостійно.',
    yourFinishConfirmationMessage:
      'Ви натиснули кнопку "Завершити". Зачекайте, поки ваш суперник або адміністратор підтвердять завершення гри.',
    finishedTournamentsTitle: "Завершені турніри",
    currentTournamentsTitle: "Поточні турніри",
    matchResultsTitle: "Результати матчу",
    upcomingTournamentsTitle: "Майбутні турніри",
    tournaments: "Турніри",
    opponentLabel: "Суперник",
    startTimeLabel: "Час початку",
    startEarlyLabel: "Почати раніше",
    finish: "Завершити",
    tournamentProgressTitle: "Управління турнірами",
    adminPanelFeatures: "Функції адміністративної панелі:",
    teamCompletedStatusDescription:
      'Натискання на назву команди встановить статус "Завершено" для турніру та присвоїть вказаній команді статус переможця.',
    playerWinnerStatusDescription:
      "Натискання на ім'я гравця надасть йому статус переможця матчу.",
    endGameAndDeclareWinnerDescription:
      'Натискання на прапорець "Завершено" завершить гру та також присвоїть статус переможця команді з найбільшою кількістю очок. {br} Якщо рахунок дорівнює нулю, переможця слід обрати вручну.',
    editMatchModeDescription:
      "Натискання на символ {edit} введе вас в режим редагування матчу, і ви зможете змінити гравців та назву карти.",
    deleteMatchDescription: "Натискання на символ {delete} видалить матч.",
    groupStage: "Груповий етап",
    completed: "Завершено",
    grid: "Сітка",
    playoff: "Плей-офф",
    mapUnspecified: "Карта не визначена",
    specifyGrid: "Вкажіть кількість етапів у сітці:",
    thirdPlace: "Матч за третє місце",
    final: "Фінал",
    starcraftTrademark: "Товарний знак StarCraft II: Legacy of the Void",
    bitmapOwnership: "а також деякі растрові зображення",
    blizzardOwnership: "належать компанії",
    language: "Мова",
    seasonIsNowUnderway: "Сезон {num} зараз в процесі",
    previousSeasons: "Попередні сезоны",
    registerTeam: "Зареєструйте свій клан та участвуйте у майбутніх турнірах!",
    showMore: "Показати більше",
    winner: "Переможець",
    games: "Ігор",
    players: "Гравці",
    playersCnt: "Гравців",
    noTournaments: "Наразі турніри не проводяться",
    registrationOpen: "Відкрито реєстрацію на участь у сезоні {season}",
    switchToParticipate: "Перейдіть у свій аккаунт, щоб узяти участь",
    signupToParticipate: "Зареєструйте свою команду, щоб узяти участь",
    signinToParticipate: "Увійдіть у свій акаунт, щоб узяти участь",
    season: "Сезон",
    seasons: "Сезони",
    teamsParticipating: "Кількість команд-учасниць",
    otherLeagues: "Інші лиги",
    mirrors: "Зеркальних",
    teams: "Команд",
    gridNotDetermined: "Сітка турніру ще не визначена",
    score: "Рахунок",
    date: "Дата",
    teamManager: "Менеджер команди",
    managerContacts: "Контакти менеджера",
    matches: "Матчі",
    result: "Результат",
    win: "Перемога",
    lose: "Поразка",
    enterManagerContacts: "Введіть контакти менеджера/ів команди",
    enterClanTag: "Введіть тег клану",
    enterClanName: "Введіть назву клану",
    enterLink: "Введіть посилання",
    removePlayerLabel: "Натисніть, щоб видалити гравця",
    addPlayerLabel: "Натисніть, щоб додати гравця",
    addPlayers: "Додати гравців",
    editLinks: "Редагувати посилання",
    clickOnPlayer: "Натисніть на гравця, щоб додати його",
    newPlayerAvatars:
      "Нові аватарки гравців зазвичай завантажуються протягом 24 годин, але деякі з них не завантажуються через помилки API Blizzard",
    teamResources: "Ресурси команди",
    linkTitle: "Назва посилання",
    link: "Посилання",
    addResource: "Додати ресурс",
    addContact: "Додати контакт",
    clickOnPlayerToTournament:
      "Натисніть на гравця у списку гравців, щоб додати його до списку учасників турніру",
    clickOnPlayerToRemove:
      "Натисніть на гравця у списку гравців нижче, щоб видалити його зі списку учасників турніру",
    clickOnPlayerToAdd:
      "Натисніть на гравця, щоб додати до списку учасників турніру",
  },
};

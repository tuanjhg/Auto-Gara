import { environment } from 'environments/environment';

const BASE_API_URL = environment.apiUrl + '/api/v1';

export enum HttpErrorMessage {
    zero = 'server.is.currently.offline',
    badRequest = 'bad.request',
    unauthorized = 'unauthorized',
    internalServerError = 'internal.server.error',
    default = 'default',
    forbidden = 'forbidden',
    notFound = 'not.found'
}

export enum TypeUser {
    customer = 1,
    installer = 2,
    coordinator = 3,
    csr = 4,
    typeUser5 = 5,
}

export enum TypePricePart {
    installation = 1,
    production = 2,
}

export enum Pages {
    dashboard = 'dashboard',
    news = 'news',
    company = 'company',
    jobsite = 'jobsite',
    basket = 'basket',
    placeOrder = 'place-order',
    historyOfOrders = 'history-of-orders',
    reports = 'reports',
    todo = 'todo',
    completed = 'completed',
    confirmOrder = 'confirm-order',
    csrApprovalOrder = 'csr-approval-order',
    confirmOrdersByLocation = 'confirm-orders-by-location',
    adminReport = 'admin-report',
    assignment = 'assignment',
    users = 'manage-users',
    userProfile = 'user-profile',
    logout = 'sign-out',
    fleet = 'fleet',
    part = 'part',
    systemConfiguration = 'system-configuration',
    impersonateCoordinator = 'impersonate-coordinator',
    savedOrders = 'saved-orders',
    paymentLink = 'payment-link',
    clientBasket = 'client-basket',
    billingAndShipping = 'billing-and-shipping',
    subsidiaryConfiguration = 'subsidiary-configuration',
    productWeights = 'product-weights',
    stampsConfiguration = 'stamps-configuration',
    subContractor = 'sub-contractor',
    importAddresses = 'import-addresses'
}

export enum StatutHeader {
    coordinatorOrder = 1,
    csrConfirmedOrder = 2,
    toBeConfirmByCSROrder = 10,
    sendToPrextraPreviousCompletedOrder = 99,
    noShowCompletedOrder = 98,
    toBeConfirmByCSRCompletedOrder = 97,
    cokeCompletedOrder = 96,
    incompletedOrder = 100
}

export enum RoleName {
    Customer = 'Customer',
    Installer = 'Installer',
    Coordinator = 'Coordinator',
    CSR = 'CSR',
    Admin = 'System Admin'
}

export enum RoleId {
    Customer = 1,
    Installer = 2,
    Coordinator = 3,
    CSR = 4,
    Admin = 5,
    Supervisor = 6,
    Salesman = 7,
    Sitecoordinator = 10,
    Verifier = 8,
    PriceSetter = 9
}

export enum StatusComplete {
    NonCompliant = 1,
    Complete = 0,
}
/**
 * Type enum for different end points
 */
enum EndPoint {
    user = 'user',
    jobsite = 'jobsite',
    search = 'search',
    order = 'order',
    payment = 'payment',
    news = 'news',
    unit = 'unit',
    kitItem = 'kitItem',
    company = 'company',
    catalogue = 'catalogue',
    tree = 'tree',
    vehicle = 'vehicle',
    log = 'log',
    photo = 'photo',
    report = 'report',
    auth = 'auth',
    header = 'header',
    roles = 'roles',
    config = 'systemConfig',
    orderMeta = 'orderMeta',
    shipTo = 'shipTo',
    submissionPrice = 'submissionPrice',
    subcCompany = 'subCompany',
    product = 'product',
    stamps = 'stamps',
    survey = 'survey',
    workTime = 'workTime',
    garaList = 'tenant',
    customer = 'customer',
}
export enum LangEnum {
    ALL = 'all',
    ENGLISH = 'en',
    FRENCH = 'fr',
};

export enum TabFleetEnum {
    fleet = 'fleet',
    part = 'parts',
};

export enum TypeVehicleEnum {
    kit = 'kits',
    standardPart = 'standardPart',
    part = 'parts'
};

export enum ShippingOptionType {
    ground = 0,
    nextDay = 1
};

export enum ShippingType {
    shippingCost = 0,
    useMyAccount = 1
};

export class Constants {
    public static BASE_API_URL: string = BASE_API_URL;
    public static END_POINT = EndPoint;
}

export enum StatusSubmission {
    draft = 'draft',
    pending = 'pending',
    approved = 'approved',
    rejected = 'rejected'
}

export const Features = {
    // Dashboard
    ACCESS_DASHBOARD: 'access-dashboard',
    // News:
    ACCESS_NEWS: 'access-news',
    // Company:
    ACCESS_COMPANIES: 'access-companies',
    // Job sites
    ACCESS_JOB_SITES: 'access-job-sites',
    // Place an order
    ACCESS_PLACE_AN_ORDER: 'access-place-an-order',
    // Completed vehicles
    ACCESS_COMPLETED_VEHICLES: 'access-completed-vehicles',
    // To-do list
    ADD_NEW_VEHICLE: 'add-new-vehicle',
    VIEW_UNIT: 'view-unit',
    TO_DO_VIEW_GUIDE: 'to-do-view-guide',
    SELECT_UNIT: 'select-unit',
    TO_DO_TAKE_PICTURE_BEFORE: 'to-do-take-picture-before',
    TO_DO_TAKE_PICTURE_AFTER: 'to-do-take-picture-after',
    CLOSE_ORDER: 'close-order',
    NO_SHOW: 'no-show',
    SHOW_ASSIGN: 'show-assign',
    SHOW_PERSON_IN_CHARGE: 'show-person-in-charge',
    ASSIGN_INSTALLER: 'assign-installer',
    ASSIGN_COORDINATOR: 'assign-coordinator',
    ACCESS_TO_DO: 'access-to-do',
    // History of Orders
    ACCESS_HISTORY_OF_ORDERS: 'access-history-of-orders',
    // Fleet
    ACCESS_FLEET: 'access-fleet',
    FLEET_VIEW_GUIDE: 'fleet-view-guide',
    SELECT_FULL_KIT: 'select-full-kit',
    SELECT_PARTS_OF_KIT: 'select-parts-of-kit',
    // Part
    ACCESS_PART: 'access-part',
    SELECT_PART: 'select-part',
    GO_TO_BASKET: 'go-to-basket',
    PART_REMOVE_ITEM: 'part-remove-item',
    // Basket
    ADD_MORE_PARTS: 'add-more-parts',
    BASKET_REMOVE_ITEM: 'basket-remove-item',
    CONTINUE_PENDING_VEHICLE: 'continue-pending-vehicle',
    CANCEL_PENDING_VEHICLE_AND_BEGIN_A_NEW_ONE: 'cancel-pending-vehicle-and-begin-a-new-one',
    FLAG_VEHICLE_AS_COMPLETED: 'flag-vehicle-as-completed',
    ACCESS_BASKET: 'access-basket',
    BASKET_TAKE_PICTURE_BEFORE: 'basket-take-picture-before',
    BASKET_TAKE_PICTURE_AFTER: 'basket-take-picture-after',
    REQUIRED_IMAGE_WHEN_CLOSE_UNIT: 'required-image-when-close-unit',
    // Confirm my orders
    ACCESS_CONFIRM_MY_ORDERS: 'access-confirm-my-orders',
    CONFIRM_MY_ORDERS_VIEW_GUIDE: 'confirm-my-orders-view-guide',
    CONFIRM_MY_ORDERS_CONFIRM_ORDER: 'confirm-my-orders-confirm-order',
    CONFIRM_MY_ORDERS_MODIFY_ORDER: 'confirm-my-orders-modify-order',
    // Confirm by CSR
    ACCESS_CONFIRM_BY_CSR: 'access-confirm-by-csr',
    CONFIRM_BY_CSR_VIEW_GUIDE: 'confirm-by-csr-view-guide',
    CONFIRM_BY_CSR_CONFIRM_ORDER: 'confirm-by-csr-confirm-order',
    CONFIRM_BY_CSR_MODIFY_ORDER: 'confirm-by-csr-modify-order',
    // Send Orders to Prextra
    ACCESS_SEND_ORDERS_TO_PREXTRA: 'access-send-orders-to-prextra',
    // Admin reports
    ACCESS_ADMIN_REPORTS: 'access-admin-reports',
    // Users
    ACCESS_USERS: 'access-users',
    CREATE_USER: 'create-user',
    EDIT_USER: 'edit-user',
    DELETE_USER: 'delete-user',
    // Profile
    ACCESS_PROFILE: 'access-user-profile',
    // Reports
    ACCESS_REPORTS: 'access-reports',
    // User Modification
    ACCESS_USER_MODIFICATION: 'access-user-modification',
    COMPANY_ASSIGNMENT: 'company-assignment',
    // Others - Change language
    CHANGE_LANGUAGE: 'change-language',
};

export const listDateWithCountry = {
    'UnitedStates': 'MM/DD/YYYY',
    'UnitedKingdom': 'DD/MM/YYYY',
    'Canada': 'YYYY/MM/DD',
    'Australia': 'DD/MM/YYYY',
    'Germany': 'DD.MM.YYYY',
    'France': 'DD/MM/YYYY',
    'Greenland': 'DD-MM-YYYY',
    'Mexico': 'DD/MM/YYYY'
};

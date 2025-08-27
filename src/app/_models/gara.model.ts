export interface GaraModel {
    tenantId: number;
    name: string;
    address: string;
    phone: number;
    email: string;
    owner_user_id: number;
    is_active: boolean;
}

export interface GaraDetailModel {
    tenantId: number;
    name: string;
    address: string;
    phone: number;
    email: string;
    ownerUser: string;
    isActive: boolean;
}
export interface AddGaralModel {
    name: string;
    address: string;
    phone: number;
    email: string;
    ownerUser: string;
    isActive: boolean;
}
export const garaDetailMockData: GaraDetailModel =
{
    tenantId: 1,
    name: 'auto gara Cầu Giấy',
    address: 'Giải Phóng',
    email: 'dungtvhe163661@gmail.com',
    isActive: true,
    ownerUser: 'Dũngdz',
    phone: 9881896554
};

export const garaListMockData: GaraModel[] = [
    {
        tenantId: 1,
        name: 'Gara Minh Tâm',
        address: '123 Lý Thường Kiệt, Quận 10, TP Hồ Chí Minh',
        phone: 905123456,
        email: 'minhtam@gmail.com',
        owner_user_id: 25,
        is_active: false
    },
    {
        tenantId: 2,
        name: 'Gara An Phát',
        address: '45 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng',
        phone: 987654321,
        email: 'anphat@yahoo.com',
        owner_user_id: 29,
        is_active: true
    },
    {
        tenantId: 3,
        name: 'Gara Hồng Phúc',
        address: '78 Lê Lợi, TP Vinh, Nghệ An',
        phone: 978123456,
        email: 'hongphuc@gmail.com',
        owner_user_id: 80,
        is_active: false
    },
    {
        tenantId: 4,
        name: 'Gara Thành Công',
        address: '56 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội',
        phone: 934567890,
        email: 'thanhcong@gmail.com',
        owner_user_id: 86,
        is_active: true
    },
    {
        tenantId: 5,
        name: 'Gara Hoàng Long',
        address: '22 Phạm Văn Đồng, Quận Cầu Giấy, Hà Nội',
        phone: 912345678,
        email: 'hoanglong@gmail.com',
        owner_user_id: 11,
        is_active: false
    },
    {
        tenantId: 6,
        name: 'Gara Tấn Phát',
        address: '89 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội',
        phone: 965123456,
        email: 'tanphat@gmail.com',
        owner_user_id: 25,
        is_active: true
    },
    {
        tenantId: 7,
        name: 'Gara Nhật Minh',
        address: '14 Hai Bà Trưng, TP Biên Hòa, Đồng Nai',
        phone: 938123456,
        email: 'nhatminh@gmail.com',
        owner_user_id: 78,
        is_active: false
    },
    {
        tenantId: 8,
        name: 'Gara Phú Quý',
        address: '321 Hùng Vương, TP Huế, Thừa Thiên Huế',
        phone: 973456789,
        email: 'phuquy@gmail.com',
        owner_user_id: 34,
        is_active: false
    },
    {
        tenantId: 9,
        name: 'Gara Đức Anh',
        address: '66 Võ Văn Kiệt, Quận 1, TP Hồ Chí Minh',
        phone: 908765432,
        email: 'ducanh@gmail.com',
        owner_user_id: 51,
        is_active: true
    },
    {
        tenantId: 10,
        name: 'Gara Anh Dũng',
        address: '11 Lê Văn Sỹ, Quận 3, TP Hồ Chí Minh',
        phone: 915123456,
        email: 'anhdung@gmail.com',
        owner_user_id: 18,
        is_active: false
    }
];




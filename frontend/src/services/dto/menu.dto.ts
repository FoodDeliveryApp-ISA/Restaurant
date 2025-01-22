export interface MenuDto {
  menuId: number;
  menuName: string;
  menuDescription: string;
  active: boolean;
}

export interface RequestMenuSaveDto {
  menuName: string;
  menuDescription: string;
}

export interface RequestUpdatedMenuDto {
  menuName?: string;
  menuDescription?: string;
  active?: boolean;
}

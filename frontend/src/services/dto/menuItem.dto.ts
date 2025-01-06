// DTO for creating a new menu item
export interface RequestMenuItemSaveDto {
  menuItemName: string;
  menuItemDescription: string;
  menuItemPrice: number;
}

// DTO for updating a menu item
export interface RequestUpdatedMenuItemDto {
  menuItemName?: string;
  menuItemDescription?: string;
  menuItemPrice?: number;
  active?: boolean;
  ImageUrls?: string[];  // Array to store multiple image URLs
}

// DTO for the response from API for a menu item
export interface MenuItemDto {
  menuItemId: number;
  menuItemName?: string;
  menuItemDescription?: string;
  menuItemPrice?: number;
  active?: boolean;
  imageUrls: string[];  // Array to store multiple image URLs
  menuId: number;
}

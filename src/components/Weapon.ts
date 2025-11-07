export type WeaponType = 'default' | 'gatling' | 'cannon';

export interface Weapon {
  weaponType: WeaponType;
  damage: number;
  fireRate: number;
  range: number;
  lastFired: number;
}

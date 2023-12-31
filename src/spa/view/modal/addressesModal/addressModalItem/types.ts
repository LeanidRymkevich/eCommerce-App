import { CustomAddress } from '@src/spa/logic/profile/profileDataManager/types';
import { IElementCreator } from '@src/spa/utils/elementCreator/types';
import { ICheckbox } from '@src/spa/view/checkbox/types';
import { IInput } from '@src/spa/view/input/types';
import { ISelect } from '@src/spa/view/select/types';

export interface IAddressModalItem {
  getView(): HTMLElement;
  getViewCreator(): IElementCreator;
  getCountryInput(): ISelect;
  getCityInput(): IInput;
  getStreetInput(): IInput;
  getPostCodeInput(): IInput;
  getIsShippingInput(): ICheckbox;
  getIsBillingInput(): ICheckbox;
  getIsDefaultShippingInput(): ICheckbox;
  getIsDefaultBillingInput(): ICheckbox;
  getAllValues(): CustomAddress;
  getID(): string;
  setID(id: string): void;
}

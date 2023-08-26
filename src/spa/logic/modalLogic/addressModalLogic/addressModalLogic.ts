import { IAddressModalItem } from '@src/spa/view/modal/addressesModal/addressModalItem/types';
import { IAddressesModal } from '@src/spa/view/modal/addressesModal/types';
import IAddressModalLogic from '@src/spa/logic/modalLogic/addressModalLogic/types';
import ModalLogic from '@src/spa/logic/modalLogic/modalLogic';
import { ICheckbox } from '@src/spa/view/checkbox/types';

export default class AddressModalLogic extends ModalLogic<IAddressesModal> implements IAddressModalLogic {
  public constructor(modal: IAddressesModal) {
    super(modal);
  }

  public countryOnChangeLogic(): void {
    this.wereChanges = true;
  }

  public cityOnChangeLogic(): void {
    this.wereChanges = true;
  }

  public streetOnChangeLogic(): void {
    this.wereChanges = true;
  }

  public postCodeOnChangeLogic(): void {
    this.wereChanges = true;
  }

  public isShippingLogic(): void {
    this.wereChanges = true;
  }

  public isBillingLogic(): void {
    this.wereChanges = true;
  }

  public defaultShippingLogic(address: IAddressModalItem): void {
    this.wereChanges = true;

    const checkbox: ICheckbox = address.getIsDefaultShippingInput();
    if (checkbox.getValue() === 'true') {
      this.modal
        .getAllAddressModalItems()
        .filter((item: IAddressModalItem): boolean => item.getID() !== address.getID())
        .forEach((item: IAddressModalItem): void => item.getIsDefaultShippingInput().check(false));
      checkbox.check(true);
    } else {
      checkbox.check(false);
    }
  }

  public defaultBillingLogic(address: IAddressModalItem): void {
    this.wereChanges = true;

    const checkbox: ICheckbox = address.getIsDefaultBillingInput();

    if (checkbox.getValue() === 'true') {
      this.modal
        .getAllAddressModalItems()
        .filter((item: IAddressModalItem): boolean => item.getID() !== address.getID())
        .forEach((item: IAddressModalItem): void => item.getIsDefaultBillingInput().check(false));
      checkbox.check(true);
    } else {
      checkbox.check(false);
    }
  }

  protected beforeCloseActions(): void {
    console.log('before accept');
  }
}

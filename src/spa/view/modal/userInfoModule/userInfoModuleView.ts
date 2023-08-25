import '@src/spa/view/modal/userInfoModule/userInfoModule.scss';
import ModalView from '@src/spa/view/modal/modalView';
import { UserParams } from '@src/spa/logic/profile/profileDataManager/types';
import { IInput, IInputViewParams } from '@src/spa/view/input/types';
import InputView from '@src/spa/view/input/inputView';
import FormView from '@src/spa/view/form/formView';
import IView from '@src/spa/view/types';

export default class UserInfoModuleView extends ModalView {
  private readonly firstNameInput: IInput;
  private readonly lastNameInput: IInput;
  private readonly birthDateInput: IInput;

  public constructor(params: UserParams) {
    super();
    this.firstNameInput = this.createFirstNameInput(params.firstName);
    this.lastNameInput = this.createLastNameInput(params.lastName);
    this.birthDateInput = this.createBirthDateInput(params.dateBirth);
    this.configure();
  }

  private configure(): void {
    const form: IView = new FormView();

    form
      .getViewCreator()
      .addInnerElement(this.firstNameInput.getView(), this.lastNameInput.getView(), this.birthDateInput.getView());
    this.addForm(form.getViewCreator());
  }

  private createFirstNameInput(firstName: string): IInput {
    const params: IInputViewParams = {
      attributes: {
        id: 'first-name',
        type: 'text',
        name: 'first-name',
        value: firstName,
      },
      textLabel: 'First name',
    };
    return new InputView(params);
  }

  private createLastNameInput(lastName: string): IInput {
    const params: IInputViewParams = {
      attributes: {
        id: 'last-name',
        type: 'text',
        name: 'last-name',
        value: lastName,
      },
      textLabel: 'Last name',
    };
    return new InputView(params);
  }

  private createBirthDateInput(date: string): IInput {
    const params: IInputViewParams = {
      attributes: {
        id: 'date-birth',
        type: 'date',
        name: 'date-birth',
        value: date,
      },
      textLabel: 'Date of birth',
    };

    return new InputView(params);
  }
}

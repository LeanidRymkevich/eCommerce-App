import ModalLogic from '@src/spa/logic/modalLogic/modalLogic';
import IEmailModalLogic, { SUCCESS_TEXT, SUCH_EMAIL_EXIST } from '@src/spa/logic/modalLogic/emailModalLogic/types';
import { IEmailModal } from '@src/spa/view/modal/emailModal/types';
import { IProfilePage } from '@src/spa/view/pages/profilePage/types';
import RegistrationValidator from '@src/spa/logic/validator/registrationValidator/registrationValidator';
import ProfileDataManager from '@src/spa/logic/profile/profileDataManager/profileDataManager';
import PopUpView from '@src/spa/view/popUp/popUpView';
import { UNKNOWN_REQUEST_ERROR } from '@src/spa/logic/modalLogic/types';

export default class EmailModalLogic extends ModalLogic<IEmailModal> implements IEmailModalLogic {
  private readonly page: IProfilePage;

  public constructor(modal: IEmailModal, page: IProfilePage) {
    super(modal);
    this.page = page;
  }

  protected validate(): boolean {
    return RegistrationValidator.emailCheck(this.modal.getEmailInput());
  }

  protected wasChanges(): boolean {
    return this.modal.getInitialState() !== this.modal.getEmailInput().getValue();
  }

  protected async beforeCloseActions(): Promise<boolean> {
    const newEmail: string = this.modal.getEmailInput().getValue();
    try {
      await ProfileDataManager.getInstance().setNewEmail(newEmail);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === SUCH_EMAIL_EXIST) {
          PopUpView.getRejectPopUp(SUCH_EMAIL_EXIST).show();
          return false;
        } else {
          PopUpView.getRejectPopUp(UNKNOWN_REQUEST_ERROR).show();
          return true;
        }
      }
    }
    PopUpView.getApprovePopUp(SUCCESS_TEXT).show();
    this.page.changeMail(newEmail);
    return true;
  }
}

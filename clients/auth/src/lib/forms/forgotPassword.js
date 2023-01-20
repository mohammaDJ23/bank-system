import { Form } from './formConstructor';
import { notification } from 'ant-design-vue';

export class ForgotPassword extends Form {
  email = '';

  constructor() {
    super();
    this.setCachedInput('email');
  }

  afterSubmit(context, res) {
    notification.success({
      message: 'Success',
      description: res.data.message,
    });
  }
}

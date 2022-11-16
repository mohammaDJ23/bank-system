import { Form } from './formConstructor';
import { ElNotification } from 'element-plus';

export class ForgotPassword extends Form {
  email = '';

  afterSubmit(context, res) {
    ElNotification({
      title: 'Success',
      message: res.data.message,
      type: 'success',
    });
  }
}

import FormContainer from '../../layout/FormContainer';
import Form from './Form';
import { UpdateUserByUser, UserObj } from '../../lib';
import { useAction, useForm, useRequest, useSelector } from '../../hooks';
import { useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from './Skeleton';
import { UserApi } from '../../apis';
import NotFound from './NotFound';

const UpdateUserByUserContent: FC = () => {
  const params = useParams();
  const { setSpecificDetails } = useAction();
  const { specificDetails } = useSelector();
  const { request, isInitialApiProcessing } = useRequest();
  const updateUserByUserFormInstance = useForm(UpdateUserByUser);
  const isInitialUserApiProcessing = isInitialApiProcessing(UserApi);

  useEffect(() => {
    const userId = params.id;
    if (userId) {
      request<UserObj, number>(new UserApi(+userId).setInitialApi()).then(response => {
        setSpecificDetails('user', response.data);
        updateUserByUserFormInstance.initializeForm(
          new UpdateUserByUser({
            id: response.data.id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phone: response.data.phone,
          })
        );
      });
    }
  }, []);

  return (
    <FormContainer>
      {isInitialUserApiProcessing ? (
        <Skeleton />
      ) : specificDetails.user ? (
        <Form formInstance={updateUserByUserFormInstance} />
      ) : (
        <NotFound />
      )}
    </FormContainer>
  );
};

export default UpdateUserByUserContent;

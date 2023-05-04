import {toast} from 'react-toastify';

export const withToast = (promise) => {
  toast.promise(promise, {
    pending: {
      render() {
        return (<div className='p-6 py-2'>
            <p className='mb-2'>
                Your transaction is being processed
            </p>
            <p>
                Wait just few more moments
            </p>
        </div>);
      },
      icon: false,
    },
    success: {
      render({ data }) {
        return (
            <div>
                <p>
                    Transaction has been succesfuly processed
                </p>
                <p className='font-bold'>
                    Tx: {data.transactionHash.slice(0, 15)}...
                </p>
                <a href={`https://polygonscan.com/tx/${data.transactionHash}`} target='_blank'>
                    <i className='text-indigo-600 underline'>See TxDetails</i>
                </a>
            </div>
        );
      },
      icon: "🟢",
    },
    error: {
      render({ data }) {
        return <div>{data.message ?? "Failed"}</div>;
      },
    },
  }
//   , {
//     closeButton: true
//   }
  );
};

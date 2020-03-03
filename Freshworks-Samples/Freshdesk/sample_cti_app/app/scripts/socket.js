/**
 * Web socket events added to respond to incoming call and call status change events
 **/
function socketIo() {
  const socket = io(middlewareUrl);
  socket.on('incoming_call', function (data) {
    showCTIApp();
    setCallSid(data.callInfo.CallSid);
    showOnCallScreen();
  });

  socket.on('handle_call_status_change', function (data) {
    if (data.callInfo.CallStatus === 'completed') {
      console.info('the call has been completed');
      hangupActiveCallApi(false);
    } else if (data.callInfo.CallStatus === 'answered') {
      console.info('the call has been answered');
    } else if (data.callInfo.CallStatus === 'busy') {
      console.info('the call is busy');
      hangupActiveCallApi(true);
    } else if (data.callInfo.CallStatus === 'no-answer') {
      console.info('the call is not answered');
      hangupActiveCallApi(true);
    } else if (data.callInfo.CallStatus === 'failed') {
      console.info('the call is failed to connect');
      hangupActiveCallApi(true);
    } else if (data.callInfo.CallStatus === 'canceled') {
      console.info('the call has been canceled');
      hangupActiveCallApi(true);
    } else {
      console.info('unknown call status:', data.callInfo.CallStatus);
      hangupActiveCallApi(true);
    }
  });

  socket.on('disconnect', () => {
    console.info('socket disconnected');
  });
}

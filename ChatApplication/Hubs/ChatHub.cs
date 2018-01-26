using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChatApplication.Models;
using Microsoft.AspNet.SignalR;

namespace ChatApplication.Hubs
{
    public class ChatHub : Hub
    {
        static List<User> Users = new List<User>();

        /// <summary>
        ///  Отправка сообщений
        /// </summary>
        /// <param name="name">Имя пользователя</param>
        /// <param name="message">Сообщение</param>
        public void Send(string name, string message)
        {
            Clients.All.addMessage(name, message);
        }

        /// <summary>
        /// Подключение нового пользователя
        /// </summary>
        /// <param name="userName">Имя пользователя</param>
        public void Connect(string userName)
        {
            var id = Context.ConnectionId;


            if (Users.All(x => x.ConnectionId != id))
            {
                Users.Add(new User { ConnectionId = id, Name = userName });

                // Посылаем сообщение текущему пользователю
                Clients.Caller.onConnected(id, userName, Users);

                // Посылаем сообщение всем пользователям, кроме текущего
                Clients.AllExcept(id).onNewUserConnected(id, userName);
            }
        }

        /// <summary>
        /// Отключение пользователя
        /// </summary>
        /// <param name="stopCalled"></param>
        /// <returns></returns>
        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            var item = Users.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                Users.Remove(item);
                var id = Context.ConnectionId;
                Clients.All.onUserDisconnected(id, item.Name);
            }

            return base.OnDisconnected(stopCalled);
        }

    }
}
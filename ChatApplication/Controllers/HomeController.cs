using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ChatApplication.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Используемые технологии в тестовом проекте";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Мои контакты";

            return View();
        }
    }
}
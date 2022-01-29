from . import __version__ as app_version

app_name = "ev_gn"
app_title = "Ev Gn"
app_publisher = "sda"
app_description = "sda"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "dsa"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/ev_gn/css/ev_gn.css"
# app_include_js = "/assets/ev_gn/js/ev_gn.js"

# include js, css files in header of web template
# web_include_css = "/assets/ev_gn/css/ev_gn.css"
# web_include_js = "/assets/ev_gn/js/ev_gn.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "ev_gn/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "ev_gn.install.before_install"
# after_install = "ev_gn.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "ev_gn.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

doc_events = {
	"Driver": {
		"validate": "ev_gn.ev_gn.hook_codes.create_employee.create"
	}
}

doc_events = {
	"Purchase Invoice": {
		"before_submit": "ev_gn.ev_gn.hook_codes.purchase_hook.update_vehicle_owner_ledgers"
	}
}


# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"ev_gn.tasks.all"
# 	],
# 	"daily": [
# 		"ev_gn.tasks.daily"
# 	],
# 	"hourly": [
# 		"ev_gn.tasks.hourly"
# 	],
# 	"weekly": [
# 		"ev_gn.tasks.weekly"
# 	]
# 	"monthly": [
# 		"ev_gn.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "ev_gn.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "ev_gn.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "ev_gn.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------
# hiii how are you
# auth_hooks = [
# 	"ev_gn.auth.validate"
# ]

# fixtures = ["Custom Field","Client Script","Property Setter", "Role", "Custom DocPerm"]
fixtures = ["Report","Property Setter","Client Script","Print Format"]
# fixtures = [
# 	{"dt": "Client Script",
# 	"filters": [["dt", "in", "Vehicle"]]}
# ]

# after_migrate = "ev_gn.ev_gn.migrate.after_migrate"\d

doc_events = {
	"Vehicle": {
		"validate": "ev_gn.post_trip_data.vehicle_share_validation"
	}
}

from infrastructure.repositories import projects_repository


def list_projects(user_id: int):
  return projects_repository.list_projects(user_id)


def get_project(user_id: int, project_id: str):
  return projects_repository.get_project(user_id, project_id)


def create_project(user_id: int, name: str, subtitle: str, progress: int):
  return projects_repository.create_project(user_id, name, subtitle, progress)


def update_project(user_id: int, project_id: str, fields: dict):
  return projects_repository.update_project(user_id, project_id, fields)


def delete_project(user_id: int, project_id: str):
  return projects_repository.delete_project(user_id, project_id)

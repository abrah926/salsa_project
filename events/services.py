from .models import CustomUser


def create_user(email, first_name, last_name, password):
    """
    Create a new user with the given details.
    """
    if not email:
        raise ValueError('The Email field must be set')
    if not password:
        raise ValueError('The Password field must be set')

    # Use the custom manager to handle user creation
    return CustomUser.objects.create_user(
        email=email,
        first_name=first_name,
        last_name=last_name,
        password=password
    )


def get_all_users():
    """
    Retrieve all users.
    """
    return CustomUser.objects.all()

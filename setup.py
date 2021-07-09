from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in ev_gn/__init__.py
from ev_gn import __version__ as version

setup(
	name='ev_gn',
	version=version,
	description='sda',
	author='sda',
	author_email='dsa',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)

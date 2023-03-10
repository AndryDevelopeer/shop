@extends('layouts.main')

@section('bread-title')
    <h1 class="m-0">Редактирование пользователя</h1>
@endsection

@section('bread-chain')
    <li class="breadcrumb-item"><a href="{{route('admin.index')}}">Главная</a></li>
    <li class="breadcrumb-item"><a href="{{route('user.index')}}">Пользователи</a></li>
    <li class="breadcrumb-item active">Редактирование пользователя</li>
@endsection

@section('content')
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <div class="card card-primary">
                        <form action="{{route('user.update', $user->id)}}" method="post">
                            @csrf
                            @method('patch')
                            <div class="card-body">
                                @foreach($fields as $fieldName => $field)
                                    <div class="form-group">
                                        <label for="exampleInputEmail1">{{$field['title']}}</label>
                                        @if($field['type'] === 'select')
                                            <select name="{{$fieldName}}"
                                                    class="custom-select mr-2 {{ $errors->has($fieldName)?'is-invalid':'' }}">
                                                @foreach($field['options'] as $option => $value)
                                                    <option {{$user->$fieldName === $option || old($fieldName) === $option  ?'selected':''}}
                                                            value="{{$option}}">
                                                        {{$value}}
                                                    </option>
                                                @endforeach
                                            </select>
                                        @elseif($field['type'] === 'role')
                                            <select name="{{$fieldName}}"
                                                    class="custom-select mr-2 {{ $errors->has($fieldName)?'is-invalid':'' }}">
                                                @foreach($roles as $role)
                                                    <option {{old('role') == $role->id ?'selected':''}} value="{{$role->id}}">
                                                        {{$role->name}}
                                                    </option>
                                                @endforeach
                                            </select>
                                        @elseif(in_array($field['type'], ['text', 'number']))
                                            <input type="{{$field['type']}}"
                                                   value="{{$fieldName !== 'password' ? old($fieldName) ?? $user->$fieldName : ''}}"
                                                   id="user-{{$fieldName}}-mask"
                                                   class="form-control {{ $errors->has($fieldName)?'is-invalid':'' }}"
                                                   name="{{$fieldName}}"
                                                   placeholder="{{$field['title']}}">
                                        @endif
                                        @if($errors->has($fieldName))
                                            <div class="alert-danger"> {{ $errors->first($fieldName) }}</div>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                            <div class="card-footer">
                                <button type="submit" class="btn btn-primary mr-1">Сохранить</button>
                                <a href="{{route('user.index')}}" class="btn btn-secondary">Отмена</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection
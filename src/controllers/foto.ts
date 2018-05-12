import { default as Foto, FotoModel } from "../models/Foto";
import { Request, Response, NextFunction } from "express";

/**
 * Cria
 */
export let create = (req: Request, res: Response, next: NextFunction) => {
  req.assert("ensaio", "Ensaio não informado").notEmpty();
  req.assert("foto", "Foto é necessário").notEmpty();
  // req.assert("clip", "Não é um base 64 válido").isBase64();

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.json({success: false, errors : errors});
  }

  const foto = new Foto(req.body);
  foto.save((err) => {
    if (err) { return next(err); }
    res.json({success: true, obj: foto});
  });
};

/**
 * Atualiza
 */
export let update = (req: Request, res: Response, next: NextFunction) => {
  // req.assert("clip", "Não é um base 64 válido").isBase64();
  req.assert("id", "ID é necessário").notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json({success: false, errors : errors});
  }

  Foto.findByIdAndUpdate(req.body.id, req.body, {new: true}, (err, obj) => {
    if (err) return next(err);
    res.json({success: true, obj: obj});
  });
};

/**
 * Remove
 */
export let remove = (req: Request, res: Response, next: NextFunction) => {
  req.assert("id", "ID é necessário").notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    return res.json({success: false, errors : errors});
  }

  Foto.findByIdAndRemove(req.params.id, (err) => {
    if (err) return next(err);
    res.json({success: true});
  });
};
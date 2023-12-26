/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.components.label;

import java.util.Optional;

import org.eclipse.emf.ecore.EObject;

import com.eclipsesource.uml.glsp.core.constants.CoreCSS;
import com.eclipsesource.uml.glsp.core.gmodel.suffix.NameLabelSuffix;
import com.eclipsesource.uml.glsp.uml.elements.class_.gmodel.GModelContext;

public class GCNameLabel
   extends GCLabel {
   public static final String CSS_ID = "gc-name-label";

   public GCNameLabel(final GModelContext context, final EObject source, final Options options) {
      super(context, source, options);

      options.id = Optional
         .of(context.suffix().appendTo(NameLabelSuffix.SUFFIX, context.idGenerator().getOrCreateId(source)));
      options.css.add(CoreCSS.TEXT_HIGHLIGHT);
   }

   @Override
   protected Optional<String> getCssIdentifier() { return Optional.of(CSS_ID); }

}

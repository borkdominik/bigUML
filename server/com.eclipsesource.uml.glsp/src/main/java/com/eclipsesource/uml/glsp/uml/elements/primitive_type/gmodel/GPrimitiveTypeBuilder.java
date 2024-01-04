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
package com.eclipsesource.uml.glsp.uml.elements.primitive_type.gmodel;

import org.eclipse.uml2.uml.PrimitiveType;

import com.eclipsesource.uml.glsp.core.constants.QuotationMark;
import com.eclipsesource.uml.glsp.sdk.cdk.GModelContext;
import com.eclipsesource.uml.glsp.sdk.cdk.base.GCProvider;
import com.eclipsesource.uml.glsp.sdk.cdk.gmodel.GCModelList;
import com.eclipsesource.uml.glsp.uml.elements.data_type.gmodel.GDataTypeBuilder;
import com.eclipsesource.uml.glsp.uml.elements.named_element.GCNamedElement;

public final class GPrimitiveTypeBuilder<TOrigin extends PrimitiveType> extends GDataTypeBuilder<TOrigin> {

   public GPrimitiveTypeBuilder(final GModelContext context, final TOrigin origin, final String type) {
      super(context, origin, type);
   }

   @Override
   protected GCProvider createHeader(final GCModelList<?, ?> container) {
      var namedElementOptions = new GCNamedElement.Options(container);
      namedElementOptions.prefix.add(QuotationMark.quoteDoubleAngle("primitive"));

      return new GCNamedElement<>(context, origin, namedElementOptions);
   }
}

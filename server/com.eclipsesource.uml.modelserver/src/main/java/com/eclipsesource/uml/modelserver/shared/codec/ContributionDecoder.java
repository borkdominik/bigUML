/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.shared.codec;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.DimensionCodec;
import com.eclipsesource.uml.modelserver.shared.codec.codecs.EdgeCodec;
import com.eclipsesource.uml.modelserver.shared.codec.codecs.ElementCodec;
import com.eclipsesource.uml.modelserver.shared.codec.codecs.ExtraCodec;
import com.eclipsesource.uml.modelserver.shared.codec.codecs.ParentCodec;
import com.eclipsesource.uml.modelserver.shared.codec.codecs.PositionCodec;
import com.eclipsesource.uml.modelserver.shared.codec.decoder.BaseDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;

public final class ContributionDecoder extends BaseDecoder
   implements PositionCodec.Decoder, ParentCodec.Decoder, ExtraCodec.Decoder, ElementCodec.Decoder, EdgeCodec.Decoder,
   DimensionCodec.Decoder {

   public ContributionDecoder(final ModelContext context) {
      super(context);
   }

   public ContributionDecoder(final URI modelUri, final EditingDomain domain, final CCommand command) {
      this(ModelContext.of(modelUri, domain, command));
   }

   public ContributionDecoder with(final CCommand command) {
      return new ContributionDecoder(ModelContext.of(context.uri, context.domain, command));
   }
}

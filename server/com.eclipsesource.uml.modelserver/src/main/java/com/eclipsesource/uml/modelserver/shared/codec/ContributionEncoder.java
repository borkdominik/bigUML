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

import com.eclipsesource.uml.modelserver.shared.codec.codecs.DimensionCodec;
import com.eclipsesource.uml.modelserver.shared.codec.codecs.EdgeCodec;
import com.eclipsesource.uml.modelserver.shared.codec.codecs.ElementCodec;
import com.eclipsesource.uml.modelserver.shared.codec.codecs.ExtraCodec;
import com.eclipsesource.uml.modelserver.shared.codec.codecs.ParentCodec;
import com.eclipsesource.uml.modelserver.shared.codec.codecs.PositionCodec;
import com.eclipsesource.uml.modelserver.shared.codec.codecs.TypeCodec;
import com.eclipsesource.uml.modelserver.shared.codec.encoder.BaseEncoder;

public final class ContributionEncoder extends BaseEncoder
   implements TypeCodec.Encoder<ContributionEncoder>, PositionCodec.Encoder<ContributionEncoder>,
   ParentCodec.Encoder<ContributionEncoder>, ExtraCodec.Encoder<ContributionEncoder>,
   ElementCodec.Encoder<ContributionEncoder>, EdgeCodec.Encoder<ContributionEncoder>,
   DimensionCodec.Encoder<ContributionEncoder> {}

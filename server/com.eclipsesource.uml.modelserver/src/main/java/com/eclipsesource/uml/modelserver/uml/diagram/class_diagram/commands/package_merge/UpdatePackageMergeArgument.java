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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.package_merge;

import com.eclipsesource.uml.modelserver.shared.codec.codecs.EmbeddedCodec;

public final class UpdatePackageMergeArgument implements EmbeddedCodec.JsonEncodable {
   public static final class Builder {
      private final UpdatePackageMergeArgument argument = new UpdatePackageMergeArgument();

      public UpdatePackageMergeArgument get() {
         return argument;
      }
   }
}
